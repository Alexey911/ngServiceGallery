(function () {
    'use strict';

    angular
        .module('ngServiceGallery.monitoring')
        .factory('monitoringService', monitoringService);

    monitoringService.inject = ['notificationService', 'storageService'];

    function monitoringService(notificationService, storageService) {
        const SERVICE_STORAGE_KEY = 'services';

        let services = null;

        return {
            getAll: getAll,
            addService: addService,
            isRegistered: isRegistered,
            removeService: removeService
        };

        function getAll() {
            services = services || storageService.get(SERVICE_STORAGE_KEY, []);
            return services;
        }

        function isRegistered(address) {
            return services
                    .filter(registered => registered.address === address)
                    .length > 0;
        }

        function addService(service) {
            if (!service) return;

            if (!service.name) service.name = extractDomain(service.address);

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
            let index = services.indexOf(service);
            services.splice(index, 1);
            storageService.save(SERVICE_STORAGE_KEY, services);
        }
    }
})();
