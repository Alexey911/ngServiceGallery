(function () {
    'use strict';

    angular
        .module('ngServiceGallery.monitoring')
        .factory('statistics', statistics);

    statistics.$inject = ['SERVICE_CONFIG', 'notificationService'];

    function statistics(SERVICE_CONFIG, notificationService) {

        let statistics = new Map();
        let subscribers = [];

        let summary = {fast: 0, medium: 0, slow: 0};

        return {
            reset: reset,
            update: update,
            remove: remove,
            getSummary: getSummary,
            register: register,
            subscribeOnSummaryChanges: subscribeOnSummaryChanges
        };

        function subscribeOnSummaryChanges(subscriber) {
            subscribers.push(subscriber);
        }

        function register(service) {
            statistics.set(service.id, emptyStatistics(service));
            return service;
        }

        function reset(service) {
            statistics.set(service.id, emptyStatistics(service));
            return service;
        }

        function remove(service) {
            return service && statistics.delete(service.id);
        }

        function getSummary() {
            return summary;
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

            updateSummary();
        }

        function updateSummary() {
            for (let statistic of statistics.values()) {
                const avg = statistic.avg;

                if (avg < SERVICE_CONFIG.FAST_SPEED) {
                    summary.fast += 1;
                } else if (avg < SERVICE_CONFIG.MEDIUM_SPEED) {
                    summary.medium += 1;
                } else if (avg < SERVICE_CONFIG.SLOW_SPEED) {
                    summary.slow += 1;
                }
            }
            subscribers.forEach(subscriber => subscriber());
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
