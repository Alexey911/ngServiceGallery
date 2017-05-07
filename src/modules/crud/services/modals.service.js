(function () {
    'use strict';

    angular
        .module('ngServiceGallery.crud')
        .factory('crudModals', crudModals);

    crudModals.$inject = ['ModalService'];

    function crudModals(ModalService) {

        return {
            showCreateRequest: showCreateRequest,
        };

        function showCreateRequest(service) {
            return createRequestModal(service).then(show);
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
