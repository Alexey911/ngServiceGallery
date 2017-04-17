(function () {
    'use strict';

    angular
        .module('ngServiceGallery.monitoring')
        .factory('monitoringService', monitoringService);

    monitoringService.$inject = ['notificationService', 'storageService', 'pingService'];

    function monitoringService(notificationService, storageService, pingService) {
        const SERVICE_STORAGE_KEY = 'services';

        let services = null;

        return {
            start: start,
            pause: pause,
            getAll: getAll,
            addService: addService,
            isFreeAddress: isFreeAddress,
            removeService: removeService
        };

        function start() {
            getAll().forEach(pingService.register);
            pingService.start();
        }

        function pause() {
            pingService.stop();
        }

        function getAll() {
            services = services || storageService.get(SERVICE_STORAGE_KEY, []);
            return services;
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

            notificationService.showMessage(
                "REGISTERED_NEW_SERVICE",
                {'service': service.name}
            );
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
        }
    }
})();
