(function () {
    'use strict';

    angular
        .module('ngServiceGallery.monitoring')
        .factory('monitoringService', monitoringService);

    monitoringService.$inject = ['modals', 'notificationService', 'storageService', 'pingService'];

    function monitoringService(modals, notificationService, storageService, pingService) {
        const SERVICE_STORAGE_KEY = 'services';

        let services = null;

        return {
            show: show,
            edit: edit,
            start: start,
            stop: stop,
            getAll: getAll,
            force: force,
            remove: remove,
            register: register,
            isFreeAddress: isFreeAddress,
            resetStatistics: resetStatistics,
            subscribe: subscribe,
            getSummary: getSummary
        };

        function subscribe(subscriber) {
            getAll().forEach(resetStatistics);
            getAll().forEach(pingService.register);
            pingService.subscribe(subscriber);
        }

        function register() {
            return modals.showRegistry().then(addService);
        }

        function show(service) {
            return modals.showSummary(service);
        }

        function remove(service) {
            return modals.showRemove(service)
                .then(confirm => confirm && removeService(service));
        }

        function edit(service) {
            return modals.showEdit(service)
                .then(modified => copyServiceFields(modified, service))
                .then(update);
        }

        function copyServiceFields(source, target) {
            if (!source) return;

            target.name = source.name;
            target.address = source.address;
            target.description = source.description;
            target.frequency = source.frequency;

            return target;
        }

        function resetStatistics(service) {
            service.ping = undefined;
        }

        function update(service) {
            resetStatistics(service);
            pingService.update(service);
        }

        function start() {
            pingService.start();
        }

        function stop() {
            pingService.stop();
        }

        function getAll() {
            services = services || storageService.get(SERVICE_STORAGE_KEY, []);
            return services;
        }

        function force() {
            pingService.force();
        }

        function isFreeAddress(address, owner) {
            return address === owner || services
                    .filter(registered => registered.address === address)
                    .length === 0;
        }

        function addService(service) {
            if (!service) return;

            if (!service.name) service.name = extractDomain(service.address);

            service.id = new Date().getMilliseconds();

            //TODO: by chain of promises
            services.push(service);
            storageService.save(SERVICE_STORAGE_KEY, services);

            notificationService.showMessage("REGISTERED_NEW_SERVICE", service);

            pingService.register(service);

            //TODO: change on single call
            pingService.start();
        }

        function getSummary() {
            return pingService.getStatistic();
        }

        function extractDomain(url) {
            let s = url.indexOf('//') + 2;
            let f = url.indexOf('/', s + 1);
            f = (f !== -1) ? f : url.length;
            return url.substr(s, f - s);
        }

        function removeService(service) {
            pingService.remove(service);
            let index = services.indexOf(service);
            services.splice(index, 1);
            storageService.save(SERVICE_STORAGE_KEY, services);
            notificationService.showMessage("SERVICE_WAS_REMOVED", service);
        }
    }
})();
