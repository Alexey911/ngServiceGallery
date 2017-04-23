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

        function calculate(statistics) {
            const snapshot = {
                min: statistics.min,
                max: statistics.max,
                count: statistics.history.length,
                history: statistics.history
            };

            return {
                min: snapshot.min,
                max: snapshot.max,
                scale: getScale(snapshot),
                frequencies: getFrequencies(snapshot)
            };
        }

        function getScale(statistics) {
            const delta = (statistics.max - statistics.min) / 9;

            const responses = Array.apply(null, Array(10)).map(Number.prototype.valueOf, 0);

            let prev = statistics.min;
            for (let i = 0; i < 10; ++i) {
                responses[i] = Math.floor(prev);
                prev += delta;
            }
            return responses;
        }

        function getFrequencies(statistics) {
            const min = statistics.min;
            const count = statistics.count;
            const delta = (statistics.max - min) / 9;

            const frequencies = Array.apply(null, Array(10)).map(Number.prototype.valueOf, 0);

            for (let i = 0; i < count; ++i) {
                let point = statistics.history[i];
                let pos = Math.floor((point.ping - min) / delta);
                frequencies[pos]++;
            }

            for (let i = 0; i < count; ++i) {
                frequencies[i] = Math.floor(100 * frequencies[i] / count);
            }
            return frequencies;
        }
    }
})();
