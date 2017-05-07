(function () {
    'use strict';

    angular
        .module('ngServiceGallery.crud')
        .component('crud', {
            templateUrl: 'crud.view.html',
            bindings: {},
            controllerAs: 'vm',
            controller: CrudController
        });

    CrudController.$inject = ['crudModals'];

    function CrudController(crudModals) {

        let vm = this;

        vm.open = open;

        function open() {
            crudModals.showCreateRequest();
        }
    }
})();
