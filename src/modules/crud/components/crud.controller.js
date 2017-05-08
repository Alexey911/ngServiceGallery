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

    CrudController.$inject = ['NgTableParams', 'crudService', 'tableRefresher'];

    function CrudController(NgTableParams, crudService, tableRefresher) {

        let vm = this;

        vm.show = show;
        vm.edit = edit;
        vm.create = create;
        vm.remove = remove;

        activate();

        function activate() {
            vm.requests = new NgTableParams(
                {
                    count: 5
                },
                {
                    counts: [],
                    paginationMinBlocks: 1,
                    paginationMaxBlocks: 5,
                    getData: load
                }
            );
        }

        function load(settings) {
            return crudService.getAll(settings);
        }

        function show(request) {
            crudService.show(request);
        }

        function create() {
            crudService.create()
                .then(refresh);
        }

        function edit(request) {
            crudService.edit(request)
                .then(refresh);
        }

        function remove(request) {
            crudService.remove(request)
                .then(refresh);
        }

        function refresh() {
            tableRefresher.refresh(vm.requests);
        }
    }
})();
