(function () {
    'use strict';

    angular
        .module('ngServiceGallery')
        .factory('monitoringService', monitoringService);

    monitoringService.inject = ['notificationService'];

    function monitoringService(notificationService) {

        let services = [
            {name: 'Vk', address: 'https://vk.com', description: 'Social network Vk'},
            {name: 'Google', address: 'https://google.com', description: 'Search engine'}
        ];

        return {
            getAll: getAll,
            addService: addService,
            isRegistered: isRegistered,
            removeService: removeService
        };

        function getAll() {
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

            services.push(service);
            notificationService.showMessage("REGISTERED_NEW_SERVICE" /*TODO: add service name*/);
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
        }
    }
})();
