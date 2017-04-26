(function () {
    'use strict';

    angular
        .module('ngServiceGallery.monitoring')
        .factory('modals', modals);

    modals.$inject = ['ModalService'];

    function modals(ModalService) {

        return {
            showEdit: showEdit,
            showRemove: showRemove,
            showSummary: showSummary,
            showRegistry: showRegistry,
            showSettings: showSettings
        };

        function showEdit(service) {
            return editModal(service).then(show);
        }

        function showRemove(service) {
            return removeModal(service).then(show);
        }

        function showSummary(service) {
            return summaryModal(service).then(show);
        }

        function showRegistry() {
            return registryModal().then(show);
        }

        function showSettings() {
            return settingsModal().then(show);
        }

        function removeModal(service) {
            return ModalService.showModal({
                templateUrl: 'delete.view.html',
                controllerAs: 'vm',
                controller: 'DeletionController',
                inputs: {service: service}
            });
        }

        function editModal(service) {
            return ModalService.showModal({
                templateUrl: 'service.view.html',
                controllerAs: 'vm',
                controller: 'EditController',
                inputs: {service: angular.copy(service)}
            });
        }

        function summaryModal(service) {
            return ModalService.showModal({
                templateUrl: 'info.view.html',
                controllerAs: 'vm',
                controller: 'ServiceInfoController',
                inputs: {service: service}
            }).then(carefulClosing);
        }

        function registryModal() {
            return ModalService.showModal({
                templateUrl: 'service.view.html',
                controllerAs: 'vm',
                controller: 'RegistrationController'
            });
        }

        function settingsModal() {
            return ModalService.showModal({
                templateUrl: 'settings.view.html',
                controllerAs: 'vm',
                controller: 'SettingsController'
            });
        }

        function show(modal) {
            modal.element.modal();
            return modal.close;
        }

        function carefulClosing(modal) {
            const closer = () => (modal.controller.exit && modal.controller.exit());
            modal.element.one('hidden.bs.modal', closer);
            return modal;
        }
    }
})();
