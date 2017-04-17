(function () {
    'use strict';

    angular
        .module('ngServiceGallery.monitoring')
        .factory('pingService', pingService);

    pingService.$inject = ['$log', '$interval'];

    function pingService($log, $interval) {

        let timers = new Map();

        return {
            stop: stop,
            start: start,
            remove: remove,
            register: register,
        };

        function register(service) {
            if (timers.has(service.id)) return;

            $log.debug(`Service[name=${service.name}] was registered for ping`);

            let config = {
                service: service,
                settings: {
                    timer: undefined
                }
            };
            timers.set(service.id, config);
        }

        function start() {
            $log.info(`Start ping`);

            for (let config of timers.values()) {
                if (!hasExecutor(config.service)) {
                    config.settings.timer = $interval(() => sendPing(config), 2500);
                }
            }
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
            }).catch(function () {
                service.ping = -1;
            });
        }
    }
})();
