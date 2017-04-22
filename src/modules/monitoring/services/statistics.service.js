(function () {
    'use strict';

    angular
        .module('ngServiceGallery.monitoring')
        .factory('statistics', statistics);

    statistics.$inject = ['$rootScope', 'SERVICE_CONFIG', 'notificationService'];

    function statistics($rootScope, SERVICE_CONFIG, notificationService) {

        let statistics = new Map();

        let summary = {fast: 0, medium: 0, slow: 0};

        return {
            reset: reset,
            update: update,
            remove: remove,
            getSummary: getSummary,
            register: register,
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

        function update(serviceId, ping) {
            let statistic = statistics.get(serviceId);
            let service = statistic.service;

            service.ping = ping;

            if (ping >= SERVICE_CONFIG.SLOW_SPEED) {
                notificationService.showMessage('WEAK_RESPONSE', service)
            }

            if (ping) {
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

                if (avg < SERVICE_CONFIG.FAST_SPEED) {
                    fast += 1;
                } else if (avg < SERVICE_CONFIG.MEDIUM_SPEED) {
                    medium += 1;
                } else if (avg < SERVICE_CONFIG.SLOW_SPEED) {
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
            };
        }
    }
})();
