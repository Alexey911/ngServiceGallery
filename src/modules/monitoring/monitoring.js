(function () {
    'use strict';

    angular
        .module('ngServiceGallery.monitoring')
        .component('monitoring', {
            templateUrl: 'monitoring.view.html',
            restrict: 'E',
            controllerAs: 'vm',
            controller: MonitoringController,
        });

    MonitoringController.$inject = ['ModalService', 'NgTableParams', 'monitoringService'];

    function MonitoringController(ModalService, NgTableParams, monitoringService) {
        let vm = this;

        vm.add = add;
        vm.remove = remove;
        vm.select = select;
        vm.refresh = refresh;
        vm.register = register;
        vm.update = update;

        activate();

        function activate() {
            vm.services = new NgTableParams(
                {
                    count: 5
                },
                {
                    dataset: getAll(),
                    counts: [5, 10, 25],
                    paginationMinBlocks: 1,
                    paginationMaxBlocks: 5
                }
            );
            vm.service = undefined;
        }

        function add(service) {
            monitoringService.add(service);
        }

        function remove(service) {
            monitoringService.removeService(service);
            refresh();
        }

        function getAll() {
            return monitoringService.getAll();
        }

        function select(service) {
            vm.service = service;
        }

        function refresh() {
            /* The table has previous state in this place,
             if there's single item & current page isn't first - manual page changing.
             */
            if (vm.services.data.length === 1) {
                let currPage = vm.services.page();
                if (currPage > 1) {
                    vm.services.page(currPage - 1);
                }
            }
            vm.services.reload();
        }

        function register() {
            ModalService.showModal({
                templateUrl: "service.view.html",
                controllerAs: 'vm',
                controller: "RegistrationController"
            }).then(function (modal) {
                modal.element.modal();
                modal.close
                    .then(monitoringService.addService)
                    .then(refresh);
            });
        }

        function update(service) {
            ModalService.showModal({
                templateUrl: "service.view.html",
                controllerAs: 'vm',
                controller: "UpdateController",
                inputs: {service: angular.copy(service)}
            }).then(function (modal) {
                modal.element.modal();
                modal.close
                    .then(function (modified) {
                        if (!modified) return;

                        service.name = modified.name;
                        service.address = modified.address;
                        service.description = modified.description;
                    })
                    .then(refresh);
            });
        }
    }
})();
