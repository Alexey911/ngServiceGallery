(function () {
    'use strict';

    angular
        .module('ngServiceGallery.monitoring')
        .factory('distributions', distributions);

    distributions.$inject = [];

    function distributions() {

        return {
            calculate: calculate
        };

        function calculate(statistics, selection) {
            const snapshot = {
                min: statistics.min,
                max: statistics.max,
                count: statistics.history.length,
                history: statistics.history
            };

            return getDistribution(snapshot, selection);
        }

        function getDistribution(statistics, selection) {
            const min = statistics.min;
            const count = statistics.count;
            const delta = (statistics.max - min) / (selection - 1);

            const frequencies = range(selection);

            for (let i = 0; i < count; ++i) {
                let point = statistics.history[i];
                let pos = Math.floor((point.ping - min) / delta);
                frequencies[pos]++;
            }

            const distribution = range(selection);
            let prev = statistics.min;

            for (let i = 0; i < selection; ++i) {
                const frequency = Math.floor(100 * frequencies[i] / count);
                const response = Math.floor(prev);

                distribution[i] = {y: frequency, x: response};
                prev += delta;
            }
            return distribution;
        }

        function range(count) {
            return Array.apply(null, Array(count)).map(Number.prototype.valueOf, 0);
        }
    }
})();
