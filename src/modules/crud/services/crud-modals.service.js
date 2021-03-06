(function () {
    'use strict';

    angular
        .module('ngServiceGallery.crud')
        .factory('crudModals', crudModals);

    crudModals.$inject = ['ModalService'];

    function crudModals(ModalService) {

        return {
            showRemove: showRemove,
            showSummary: showSummary,
            showEditRequest: showEditRequest,
            showCreateRequest: showCreateRequest,
        };

        function showRemove(request) {
            return createRemoveModal(request).then(show);
        }

        function showSummary(request) {
            return createSummaryModal(request).then(show);
        }

        function showCreateRequest() {
            return createRequestModal().then(show);
        }

        function showEditRequest(request) {
            return createEditRequestModal(request).then(show);
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

        function createSummaryModal(request) {
            return ModalService.showModal({
                templateUrl: 'request-info.view.html',
                controllerAs: 'vm',
                controller: 'RequestInfoController',
                inputs: {
                    request: angular.copy(request)
                }
            });
        }

        function createRequestModal() {
            return ModalService.showModal({
                templateUrl: 'edit.view.html',
                controllerAs: 'vm',
                controller: 'EditRequestController',
                inputs: {
                    mode: 'create',
                    title: 'CREATE_REQUEST',
                    request: undefined
                }
            });
        }

        function createEditRequestModal(request) {
            return ModalService.showModal({
                templateUrl: 'edit.view.html',
                controllerAs: 'vm',
                controller: 'EditRequestController',
                inputs: {
                    mode: 'edit',
                    title: 'EDIT_REQUEST',
                    request: angular.copy(request)
                }
            });
        }

        function show(modal) {
            modal.element.modal();
            return modal.close;
        }
    }
})();
