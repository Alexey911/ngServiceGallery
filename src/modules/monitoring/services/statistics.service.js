(function () {
    'use strict';

    angular
        .module('ngServiceGallery.monitoring')
        .factory('statistics', statistics);

    statistics.$inject = ['$rootScope', 'RESPONSE_SPEED', 'notificationService'];

    function statistics($rootScope, RESPONSE_SPEED, notificationService) {

        let statistics = new Map();

        let summary = {fast: 0, medium: 0, slow: 0};

        return {
            reset: reset,
            update: update,
            remove: remove,
            register: register,
            getSummary: getSummary,
            getStatistics: getStatistics
        };

        function getSummary() {
            return summary;
        }

        function register(service) {
            if (!service) return;

            statistics.set(service.id, emptyStatistics(service));
            return service;
        }

        function reset(service) {
            if (!service) return;

            statistics.set(service.id, emptyStatistics(service));
            return service;
        }

        function remove(service) {
            if (service && statistics.has(service.id)) {
                statistics.delete(service.id);
                updateSummary();
            }
            return service;
        }

        function getStatistics(service) {
            return statistics.get(service.id);
        }

        function update(serviceId, ping) {
            let statistic = statistics.get(serviceId);
            let service = statistic.service;

            service.ping = ping || RESPONSE_SPEED.UNKNOWN;
            statistic.history.push({time: new Date(), ping: service.ping});

            if (ping >= RESPONSE_SPEED.SLOW) {
                notificationService.showMessage('WEAK_RESPONSE', service)
            }

            if (ping > 0) {
                statistic.attempts += 1;
                statistic.commonTime += ping;

                statistic.avg = statistic.commonTime / statistic.attempts;

                if (ping > statistic.max || !statistic.max) statistic.max = ping;
                if (ping < statistic.min || !statistic.min) statistic.min = ping;
            } else {
                statistic.fails += 1;
            }

            $rootScope.$apply(updateSummary);
        }

        function updateSummary() {
            let fast = 0, medium = 0, slow = 0;

            for (let statistic of statistics.values()) {
                const avg = statistic.avg;

                if (avg < RESPONSE_SPEED.FAST) {
                    fast += 1;
                } else if (avg < RESPONSE_SPEED.MEDIUM) {
                    medium += 1;
                } else if (avg < RESPONSE_SPEED.SLOW) {
                    slow += 1;
                }
            }

            summary.fast = fast;
            summary.slow = slow;
            summary.medium = medium;
        }

        function emptyStatistics(service) {
            service.ping = undefined;

            return {
                fails: 0,
                attempts: 0,
                commonTime: 0,
                min: undefined,
                avg: undefined,
                max: undefined,
                service: service,
                history: []
            };
        }
    }
})();
