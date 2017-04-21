(function () {
    'use strict';

    angular
        .module('ngServiceGallery.monitoring')
        .factory('monitoringService', monitoringService);

    monitoringService.$inject = ['MONITORING_CONFIG', 'modals', 'notificationService', 'storageService', 'pingService'];

    function monitoringService(MONITORING_CONFIG, modals, notificationService, storageService, pingService) {

        let services = null;

        setUp();

        return {
            show: show,
            edit: edit,
            getAll: getAll,
            remove: remove,
            register: register,
            subscribe: subscribe,
            isBusyAddress: isBusyAddress
        };

        function setUp() {
            getAll().forEach(resetPing);
            getAll().forEach(pingService.register);
        }

        function show(service) {
            return modals.showSummary(service);
        }

        function getAll() {
            services = services || storageService.get(MONITORING_CONFIG.SERVICES, []);
            return services;
        }

        function subscribe(subscriber) {
            pingService.subscribe(subscriber);
        }

        function register() {
            return modals.showRegistry().then(save);
        }

        function remove(service) {
            return modals.showRemove(service)
                .then(confirm => confirm && unregisterAndRemove(service));
        }

        function edit(service) {
            return modals.showEdit(service)
                .then(modified => copyServiceFields(modified, service))
                .then(resetPing)
                .then(pingService.reset);
        }

        function save(service) {
            if (!service) return;

            if (!service.name) service.name = extractDomain(service.address);

            service.id = new Date().getMilliseconds();

            services.push(service);
            saveChanges();
            pingService.register(service);

            notificationService.showMessage('REGISTERED_NEW_SERVICE', service);
        }

        function unregisterAndRemove(service) {
            pingService.remove(service);

            let index = services.indexOf(service);
            services.splice(index, 1);

            saveChanges();
            notificationService.showMessage('SERVICE_WAS_REMOVED', service);
        }

        function isBusyAddress(address, owner) {
            return address !== owner && services
                    .filter(registered => registered.address === address)
                    .length > 0;
        }

        function saveChanges() {
            storageService.save(MONITORING_CONFIG.SERVICES, services);
        }

        function resetPing(service) {
            service.ping = undefined;
            return service;
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
            target.frequency = source.frequency;

            return target;
        }
    }
})();
