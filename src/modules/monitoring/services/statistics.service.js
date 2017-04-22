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
            service.ping = undefined;

            statistics.set(service.id, emptyStatistics());
            return service;
        }

        function reset(service) {
            service.ping = undefined;

            statistics.set(service.id, emptyStatistics());
            return service;
        }

        function remove(service) {
            return service && statistics.delete(service.id);
        }

        function getSummary() {
            return summary;
        }

        function update(service, ping) {
            service.ping = ping;

            if (ping >= SERVICE_CONFIG.SLOW_SPEED) {
                notificationService.showMessage('WEAK_RESPONSE', service)
            }

            let data = statistics.get(service.id);

            if (ping) {
                data.attempts += 1;
                data.commonTime += ping;

                data.avg = data.commonTime / data.attempts;

                if (ping > data.max || !data.max) data.max = ping;
                if (ping < data.min || !data.min) data.min = ping;
            } else {
                data.fails += 1;
            }

            updateSummary();
            return service;
        }

        function updateSummary() {
            for (let data of statistics.values()) {
                const avg = data.avg;

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

        function emptyStatistics() {
            return {
                fails: 0,
                attempts: 0,
                commonTime: 0,
                min: undefined,
                avg: undefined,
                max: undefined,
            };
        }
    }
})();
