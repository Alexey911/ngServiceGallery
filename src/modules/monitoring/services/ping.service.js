(function () {
    'use strict';

    angular
        .module('ngServiceGallery.monitoring')
        .factory('pingService', pingService);

    pingService.$inject = ['$log', '$interval', 'notificationService'];

    function pingService($log, $interval, notificationService) {

        let timers = new Map();

        //TODO: change notification-subscriber binding way
        let subscriber = null;

        return {
            stop: stop,
            start: start,
            force: force,
            remove: remove,
            register: register,
            subscribe: subscribe,
        };

        function subscribe(item) {
            subscriber = item;
        }

        function register(service) {
            if (timers.has(service.id)) return;

            $log.debug(`Service[name=${service.name}] was registered for ping`);

            let config = {
                service: service,
                statistics: {
                    fails: 0,
                    attempts: 0,
                    commonTime: 0,
                    min: undefined,
                    avg: undefined,
                    max: undefined,
                },
                settings: {
                    timer: undefined,
                    frequency: 2500
                }
            };
            timers.set(service.id, config);
        }

        function start() {
            $log.info(`Start ping`);

            for (let config of timers.values()) {
                if (!hasExecutor(config.service)) {
                    config.settings.timer = $interval(() => sendPing(config),
                        config.settings.frequency
                    );
                }
            }
        }

        function force() {
            for (let config of timers.values()) sendPing(config);
        }

        function stop() {
            $log.info(`Stop ping`);

            for (let config of timers.values()) {
                tryToStopTimer(config.settings.timer);
                config.settings.timer = undefined;
            }
        }

        function remove(service) {
            let key = service.id;

            if (!timers.has(key)) return;

            let config = timers.get(key);
            tryToStopTimer(config.settings.timer);
            timers.delete(key);
        }

        function tryToStopTimer(timer) {
            if (angular.isDefined(timer)) {
                $interval.cancel(timer);
            }
        }

        function hasExecutor(service) {
            let id = service.id;
            return timers.has(id) && angular.isDefined(timers.get(id).settings.timer);
        }

        function sendPing(config) {
            let service = config.service;

            $log.debug(`Staring ping for Service[name=${service.name}]`);

            ping(service.address).then(function (delta) {
                service.ping = delta;

                if (delta >= 3500.0) {
                    notificationService.showMessage('WEAK_RESPONSE', service)
                }

                recountStatistics(config, delta);
                subscriber(service);
            }).catch(function (/*TODO: never called*/) {
                service.ping = -1;
                recountStatistics(config);
                subscriber(service);
            });
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
    }
})();
