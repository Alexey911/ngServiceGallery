(function () {
    'use strict';

    angular
        .module('ngServiceGallery.monitoring')
        .factory('pingService', pingService);

    pingService.$inject = ['$log', 'notificationService', 'scheduler'];

    function pingService($log, notificationService, scheduler) {

        let services = new Map();

        let subscribers = [];

        return {
            stop: stop,
            start: start,
            reset: reset,
            remove: remove,
            register: register,
            subscribe: subscribe,
            getSummary: getSummary
        };

        function subscribe(subscriber) {
            subscribers.push(subscriber);
        }

        function register(service) {
            if (services.has(service.id)) return;

            $log.debug(`Service[name=${service.name}] was registered for ping`);

            const config = {
                task: undefined,
                original: service,
                statistics: {
                    fails: 0,
                    attempts: 0,
                    commonTime: 0,
                    min: undefined,
                    avg: undefined,
                    max: undefined,
                }
            };

            resetPing(config);
            scheduler.schedule(() => sendPing(config), 500, 1);
            services.set(service.id, config);
        }

        function start() {
            $log.info(`Start ping`);

            for (let config of services.values()) {
                if (!scheduler.hasExecutor(config.task)) {
                    config.task = scheduler.schedule(() => sendPing(config), config.original.frequency);
                } else {
                    sendPing(config);
                }
            }
        }

        function reset(service) {
            if (!service) return;

            const config = services.get(service.id);

            resetPing(config);

            if (!scheduler.hasExecutor(config.task)) {
                sendPing(config);
            } else {
                scheduler.update(service.task, config.original.frequency);
            }
        }

        function stop() {
            $log.info(`Stop ping`);
            scheduler.shutDown();
        }

        function remove(service) {
            scheduler.stop(service.task);
            services.delete(service.id);
        }

        function sendPing(config) {
            let service = config.original;

            $log.debug(`Staring ping for Service[name=${service.name}]`);

            ping(service.address).then(function (delta) {
                service.ping = delta;
                service.color = color(delta);

                if (delta >= 3500.0) {
                    notificationService.showMessage('WEAK_RESPONSE', service)
                }

                recountStatistics(config, delta);
                notify(service);
            }).catch(function (/*TODO: never called*/) {
                service.ping = -1;
                recountStatistics(config);
                notify(service);
            });
        }

        function color(ping) {
            let red = {color: "red"};
            let dark = {color: "darkRed"};
            let green = {color: "green"};
            let orange = {color: "orange"};

            if (ping === -1) {
                return red;
            } else if (ping < 350.0) {
                return green;
            } else if (ping < 1000.0) {
                return orange;
            } else if (ping < 2000.0) {
                return red;
            }

            return dark;
        }

        function recountStatistics(config, ping) {
            let statistics = config.statistics;

            if (ping) {
                statistics.attempts += 1;
                statistics.commonTime += ping;

                statistics.avg = statistics.commonTime / statistics.attempts;

                if (ping > statistics.max || !statistics.max) statistics.max = ping;
                if (ping < statistics.min || !statistics.min) statistics.min = ping;
            } else {
                statistics.fails += 1;
            }
        }

        function resetPing(config) {
            config.original.ping = undefined;
        }

        function getSummary() {
            let summary = {fast: 0, medium: 0, slow: 0};

            for (let config of services.values()) {
                const avg = config.statistics.avg;

                if (avg < 350) {
                    summary.fast += 1;
                } else if (avg < 1000) {
                    summary.medium += 1;
                } else if (avg < 3500) {
                    summary.slow += 1;
                }
            }
            return summary;
        }

        function notify(service) {
            subscribers.forEach(subscriber => subscriber(service));
        }
    }
})();
