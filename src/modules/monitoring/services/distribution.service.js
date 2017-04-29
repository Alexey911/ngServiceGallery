(function () {
    'use strict';

    angular
        .module('ngServiceGallery.monitoring')
        .factory('distributions', distributions);

    distributions.$inject = ['$log'];

    function distributions($log) {

        return {
            calculate: calculate,
            getExpected: getExpected
        };

        function getExpected(statistics, count) {
            const borders = getBorders(statistics, count);

            const delta = 1 / (borders.finish - borders.start - 1);
            let factor = 0, expected = 0;

            for (let i = borders.start; i < borders.finish; ++i) {
                expected += (0.5 + factor) * statistics.history[i].ping;
                factor += delta;
            }
            return expected / (borders.finish - borders.start);
        }

        function getMiddle(data, borders) {
            const s = borders.start, f = borders.finish;

            let sum = 0;
            for (let i = s; i < f; ++i) sum += data.history[i].ping;

            return sum / (f - s);
        }

        function calculate(data, selection, expected) {
            $log.debug('getting distribution');

            if (data.history.length <= 1) {
                return {expected: data.avg, distribution: []};
            }

            const statistics = getStatistics(data, selection);
            return getDistribution(data, statistics, expected);
        }

        function getDistribution(data, statistics, expected) {
            const frequencies = range(expected);

            const delta = (statistics.max - statistics.min) / (expected - 1);
            const min = statistics.min;
            const max = statistics.max;

            let count = 0;

            for (let i = statistics.start; i < statistics.finish; ++i) {
                const ping = data.history[i].ping;

                if (ping >= min && ping <= max) {
                    const pos = Math.round((ping - min) / delta);
                    frequencies[pos]++;
                    count++;
                }
            }

            const distribution = range(expected);
            let prev = min;

            for (let i = 0; i < expected; ++i) {
                const frequency = 100 * frequencies[i] / count;

                distribution[i] = {y: frequency.toFixed(2), x: prev.toFixed(2)};
                prev += delta;
            }

            return {
                min: min,
                max: max,
                distribution: distribution
            };
        }

        function getStatistics(data, selection) {
            const borders = getBorders(data, selection);
            const middle = getMiddle(data, borders);
            const delta = 1.5 * getDeviation(data, borders, middle);

            const min = Math.max(middle - delta, 0);
            const max = middle + delta;

            return {
                min: min,
                max: max,
                start: borders.start,
                finish: borders.finish
            }
        }

        function getDeviation(data, borders, expected) {
            let deviation = 0;

            for (let i = borders.start; i < borders.finish; ++i) {
                let diff = data.history[i].ping - expected;
                deviation += diff * diff;
            }

            return Math.sqrt(deviation / (borders.finish - borders.start));
        }

        function getBorders(data, count) {
            let s = 0, f = data.history.length;

            if (f >= count) s = f - count;

            return {start: s, finish: f};
        }

        function range(count) {
            return Array.apply(null, Array(count)).map(Number.prototype.valueOf, 0);
        }
    }
})();
