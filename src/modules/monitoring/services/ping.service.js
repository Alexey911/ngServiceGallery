(function () {
    'use strict';

    angular
        .module('ngServiceGallery.monitoring')
        .factory('pingService', pingService);

    pingService.$inject = ['$log', 'scheduler', 'statistics', 'ping'];

    function pingService($log, scheduler, statistics, ping) {

        let configurations = new Map();
        let running = false;

        return {
            stop: stop,
            start: start,
            reset: reset,
            force: force,
            remove: remove,
            register: register,
            isRunning: isRunning
        };

        function isRunning() {
            return configurations.size > 0 && running;
        }

        function register(service) {
            if (!service || configurations.has(service.id)) return;

            $log.debug(`Service[name=${service.name}] was registered for ping`);

            const config = {
                id: service.id,
                task: undefined,
                name: service.name,
                url: service.address,
                frequency: service.settings.frequency,
            };

            scheduler.schedule(() => sendPing(config), 1500, 1);
            configurations.set(service.id, config);

            return service;
        }

        function force() {
            for (let config of configurations.values()) {
                sendPing(config);
            }
        }

        function start() {
            $log.info(`Start ping`);

            for (let config of configurations.values()) {
                if (!scheduler.hasExecutor(config.task)) {
                    config.task = scheduler.schedule(() => sendPing(config), config.frequency);
                    running = true;
                }
            }
        }

        function reset(service) {
            if (!service) return;

            let config = configurations.get(service.id);

            config.url = service.address;
            config.name = service.name;
            config.frequency = service.settings.frequency;

            if (!scheduler.hasExecutor(config.task)) {
                sendPing(config);
            } else {
                config.task = scheduler.update(config.task, config.frequency);
            }

            return service;
        }

        function stop() {
            $log.info(`Stop ping`);

            for (let config of configurations.values()) {
                scheduler.stop(config.task);
                config.task = undefined;
            }
            running = false;
        }

        function remove(service) {
            if (!service) return;

            let config = configurations.get(service.id);

            scheduler.stop(config.task);
            configurations.delete(config.id);

            return service;
        }

        function sendPing(config) {
            $log.debug(`Staring ping for Service[name=${config.name}]`);

            ping.send(config.url).then(function (delta) {
                statistics.update(config.id, delta);
            }).catch(function () {
                statistics.update(config.id);
            });
        }
    }
})();
