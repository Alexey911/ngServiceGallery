(function () {
    'use strict';

    angular
        .module('ngServiceGallery.monitoring')
        .factory('pingService', pingService);

    pingService.$inject = ['$log', 'scheduler', 'statistics'];

    function pingService($log, scheduler, statistics) {

        let services = new Map();

        return {
            stop: stop,
            start: start,
            reset: reset,
            force: force,
            remove: remove,
            register: register,
        };

        function register(service) {
            if (!service || services.has(service.id)) return;

            $log.debug(`Service[name=${service.name}] was registered for ping`);

            const data = {
                task: undefined,
                owner: service
            };

            scheduler.schedule(() => sendPing(data), 500, 1);
            services.set(service.id, data);

            return service;
        }

        function force() {
            for (let service of services.values()) {
                sendPing(service);
            }
        }

        function start() {
            $log.info(`Start ping`);

            for (let service of services.values()) {
                if (!scheduler.hasExecutor(service.task)) {
                    service.task = scheduler.schedule(() => sendPing(service), service.owner.settings.frequency);
                }
            }
        }

        function reset(service) {
            if (!service) return;

            service = services.get(service.id);

            if (!scheduler.hasExecutor(service.task)) {
                sendPing(config);
            } else {
                scheduler.update(service.task, config.owner.settings.frequency);
            }
        }

        function stop() {
            $log.info(`Stop ping`);
            scheduler.shutDown();
        }

        function remove(service) {
            if (!service) return;

            scheduler.stop(service.task);
            services.delete(service.id);
        }

        function sendPing(config) {
            let service = config.owner;

            $log.debug(`Staring ping for Service[name=${service.name}]`);

            ping(service.address).then(function (delta) {
                statistics.update(service, delta);
            }).catch(function (/*TODO: never called*/) {
                statistics.update(service);
            });
        }
    }
})();
