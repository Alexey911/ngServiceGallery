(function () {
    'use strict';

    angular
        .module('ngServiceGallery.monitoring')
        .factory('distributions', distributions);

    distributions.$inject = ['$log'];

    function distributions($log) {

        const MAX_DISTRIBUTION_SELECTION = 40;

        return {
            calculate: calculate,
            getExpected: getExpected
        };

        function getExpected(statistics, count) {
            let s = 0, f = statistics.history.length;

            if (f >= count) s = f - count;

            let sum = 0;
            for (let i = s; i < f; ++i) sum += statistics.history[i].ping;

            return sum / (f - s);
        }

        function calculate(statistics, selection) {
            $log.debug('getting distribution');

            if (statistics.history.length <= 1) {
                return {expected: statistics.avg, distribution: []};
            }

            const snapshot = getSnapshot(statistics);
            return getStatistic(snapshot, selection);
        }

        function getStatistic(statistics, selection) {
            const deviation = 1.5 * getDeviation(statistics);

            const min = (statistics.avg - deviation) > 0 ? (statistics.avg - deviation) : 0;
            const max = statistics.avg + deviation;

            const frequencies = range(selection);
            const delta = (max - min) / (selection - 1);
            let count = 0;

            for (let i = statistics.start; i < statistics.finish; ++i) {
                const ping = statistics.history[i].ping;

                if (ping >= min && ping <= max) {
                    const pos = Math.round((ping - min) / delta);
                    frequencies[pos]++;
                    count++;
                }
            }

            const distribution = range(selection);
            let prev = min;

            for (let i = 0; i < selection; ++i) {
                const frequency = 100 * frequencies[i] / count;

                distribution[i] = {y: frequency.toFixed(2), x: prev.toFixed(2)};
                prev += delta;
            }

            return {
                min: min,
                max: max,
                expected: statistics.avg,
                distribution: distribution
            };
        }

        function getDeviation(statistics) {
            let deviation = 0;

            for (let i = statistics.start; i < statistics.finish; ++i) {
                let diff = statistics.history[i].ping - statistics.avg;
                deviation += diff * diff;
            }

            return Math.sqrt(deviation / (statistics.finish - statistics.start));
        }

        function getSnapshot(statistics) {
            const snapshot = {
                avg: 0,
                start: 0,
                finish: statistics.history.length,
                history: statistics.history
            };

            if (snapshot.finish > MAX_DISTRIBUTION_SELECTION) {
                snapshot.start = snapshot.finish - MAX_DISTRIBUTION_SELECTION;
            }
            snapshot.avg = getExpected(statistics, MAX_DISTRIBUTION_SELECTION);

            return snapshot;
        }

        function range(count) {
            return Array.apply(null, Array(count)).map(Number.prototype.valueOf, 0);
        }
    }
})();
