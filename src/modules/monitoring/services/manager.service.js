(function () {
    'use strict';

    angular
        .module('ngServiceGallery.monitoring')
        .factory('serviceManager', serviceManager);

    serviceManager.$inject = ['SERVICE_CONFIG', 'modals', 'storageService', 'notificationService'];

    function serviceManager(SERVICE_CONFIG, modals, storageService, notificationService) {

        let services = null;

        return {
            show: show,
            edit: edit,
            getAll: getAll,
            remove: remove,
            register: register,
            configure: configure,
            isBusyAddress: isBusyAddress
        };

        function show(service) {
            return modals.showSummary(service);
        }

        function getAll() {
            services = services || storageService.get(SERVICE_CONFIG.STORAGE_PLACE, []);
            return services;
        }

        function configure() {
            modals.showSettings();
        }

        function register() {
            return modals.showRegistry().then(save);
        }

        function remove(service) {
            return modals.showRemove(service)
                .then(confirm => confirm && clean(service));
        }

        function edit(service) {
            return modals.showEdit(service)
                .then(modified => copyServiceFields(modified, service));
        }

        function save(service) {
            if (!service) return;

            if (!service.name) service.name = extractDomain(service.address);

            service.id = new Date().getTime();

            services.unshift(service);
            storageService.save(SERVICE_CONFIG.STORAGE_PLACE, services);
            notificationService.showMessage('REGISTERED_NEW_SERVICE', service);

            return service;
        }

        function clean(service) {
            let index = services.indexOf(service);
            services.splice(index, 1);

            storageService.save(SERVICE_CONFIG.STORAGE_PLACE, services);
            notificationService.showMessage('SERVICE_WAS_REMOVED', service);

            return service;
        }

        function isBusyAddress(address, owner) {
            return address !== owner && services
                    .filter(registered => registered.address === address)
                    .length > 0;
        }

        function extractDomain(url) {
            let s = url.indexOf('//') + 2;
            let f = url.indexOf('/', s + 1);
            f = (f !== -1) ? f : url.length;
            return url.substr(s, f - s);
        }

        function copyServiceFields(source, target) {
            if (!source) return;

            target.name = source.name;
            target.address = source.address;
            target.description = source.description;
            target.settings.frequency = source.settings.frequency;

            return target;
        }
    }
})();
