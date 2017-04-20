(function () {
    'use strict';

    angular
        .module('ngServiceGallery.monitoring')
        .factory('pingService', pingService);

    pingService.$inject = ['$log', '$interval', 'notificationService'];

    function pingService($log, $interval, notificationService) {

        //TODO: rename
        let timers = new Map();

        //TODO: change notification-subscriber binding way
        let subscriber = null;

        return {
            stop: stop,
            start: start,
            force: force,
            update: update,
            remove: remove,
            register: register,
            subscribe: subscribe,
            getStatistic: getStatistic,
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
                    timer: undefined
                }
            };
            timers.set(service.id, config);
        }

        function update(service) {
            const config = timers.get(service.id);

            tryStopTimer(config.settings.timer);
            startTimer(config);
        }

        function start() {
            $log.info(`Start ping`);

            for (let config of timers.values()) {
                startTimer(config);
            }
        }

        function startTimer(config) {
            if (!hasExecutor(config.service)) {
                config.settings.timer = $interval(() => sendPing(config),
                    config.service.frequency
                );
            }
        }

        function force() {
            for (let config of timers.values()) sendPing(config);
        }

        function stop() {
            $log.info(`Stop ping`);

            for (let config of timers.values()) {
                tryStopTimer(config.settings.timer);
                config.settings.timer = undefined;
            }
        }

        function remove(service) {
            let key = service.id;

            if (!timers.has(key)) return;

            let config = timers.get(key);
            tryStopTimer(config.settings.timer);
            timers.delete(key);
        }

        function tryStopTimer(timer) {
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

        function getStatistic() {
            let statistic = {fast: 0, medium: 0, slow: 0};

            for (let config of timers.values()) {
                const avg = config.statistics.avg;

                if (avg < 350) {
                    statistic.fast += 1;
                } else if (avg < 1000) {
                    statistic.medium += 1;
                } else if (avg < 3500) {
                    statistic.slow += 1;
                }
            }
            return statistic;
        }
    }
})();
