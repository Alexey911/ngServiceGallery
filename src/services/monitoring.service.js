(function () {
    'use strict';

    angular
        .module('ngServiceGallery')
        .factory('monitoringService', monitoringService);

    monitoringService.inject = [];

    function monitoringService() {

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
            services.push(service);
        }

        function removeService(service) {
            let index = services.indexOf(service);
            services.splice(index, 1);
        }
    }
})();
