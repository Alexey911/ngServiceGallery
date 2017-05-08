(function () {
    'use strict';

    angular
        .module('ngServiceGallery.crud')
        .factory('crudModals', crudModals);

    crudModals.$inject = ['ModalService'];

    function crudModals(ModalService) {

        return {
            showRemove: showRemove,
            showCreateRequest: showCreateRequest,
        };

        function showRemove(request) {
            return createRemoveModal(request).then(show);
        }

        function showCreateRequest() {
            return createRequestModal().then(show);
        }

        function createRemoveModal(request) {
            return ModalService.showModal({
                templateUrl: 'confirm.view.html',
                controllerAs: 'vm',
                controller: 'ConfirmController',
                inputs: {
                    title: 'REQUEST_DELETION',
                    message: 'REQUEST_DELETION_CONFIRM',
                    data: request
                }
            });
        }

        function createRequestModal() {
            return ModalService.showModal({
                templateUrl: 'edit.view.html',
                controllerAs: 'vm',
                controller: 'EditRequestController'
            });
        }

        function show(modal) {
            modal.element.modal();
            return modal.close;
        }
    }
})();
