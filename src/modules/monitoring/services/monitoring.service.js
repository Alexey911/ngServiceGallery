(function () {
    'use strict';

    angular
        .module('ngServiceGallery.monitoring')
        .factory('monitoringService', monitoringService);

    monitoringService.$inject = ['ModalService', 'notificationService', 'storageService', 'pingService'];

    function monitoringService(ModalService, notificationService, storageService, pingService) {
        const SERVICE_STORAGE_KEY = 'services';

        let services = null;

        return {
            show: show,
            edit: edit,
            setUp: setUp,
            start: start,
            pause: pause,
            getAll: getAll,
            refresh: refresh,
            remove: remove,
            register: register,
            isFreeAddress: isFreeAddress,
            resetStatistics: resetStatistics,
            getCommonStatistic: getCommonStatistic
        };

        function register() {
            return registrationForm()
                .then(open)
                .then(addService);
        }

        function registrationForm() {
            return ModalService.showModal({
                templateUrl: "service.view.html",
                controllerAs: 'vm',
                controller: "RegistrationController"
            });
        }

        function show(service) {
            return summaryForm(service)
                .then(open);
        }

        function summaryForm(service) {
            return ModalService.showModal({
                templateUrl: "info.view.html",
                controllerAs: 'vm',
                controller: "ServiceInfoController",
                inputs: {service: service}
            })
        }

        function remove(service) {
            return removalForm(service)
                .then(open)
                .then(confirm => confirm && removeService(service));
        }

        function removalForm(service) {
            return ModalService.showModal({
                templateUrl: "delete.view.html",
                controllerAs: 'vm',
                controller: "DeletionController",
                inputs: {service: service}
            });
        }

        function edit(service) {
            return editingForm(service)
                .then(open)
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

        function editingForm(service) {
            return ModalService.showModal({
                templateUrl: "service.view.html",
                controllerAs: 'vm',
                controller: "EditController",
                inputs: {service: angular.copy(service)}
            });
        }

        function open(modal) {
            modal.element.modal();
            return modal.close;
        }

        function setUp(subscriber) {
            getAll().forEach(resetStatistics);
            getAll().forEach(pingService.register);
            pingService.subscribe(subscriber);
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

        function pause() {
            pingService.stop();
        }

        function getAll() {
            services = services || storageService.get(SERVICE_STORAGE_KEY, []);
            return services;
        }

        function refresh() {
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

        function getCommonStatistic() {
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
