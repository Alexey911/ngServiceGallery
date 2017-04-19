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

        vm.force = force;
        vm.remove = remove;
        vm.register = register;
        vm.update = update;
        vm.pause = pause;
        vm.start = start;
        vm.color = color;

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
        }

        function color(ping) {
            let red = {color: "red"};
            let dark = {color: "darkRed"};
            let green = {color: "green"};
            let orange = {color: "orange"};

            if (ping === -1) {
                return red;
            } else if (ping < 350.0) {
                return green;
            } else if (ping < 1000.0) {
                return orange;
            } else if (ping < 2000.0) {
                return red;
            }

            return dark;
        }

        function force() {
            monitoringService.refresh();
        }

        function start() {
            monitoringService.start();
        }

        function getAll() {
            return monitoringService.getAll();
        }

        function pause() {
            monitoringService.pause();
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

        function remove(service) {
            ModalService.showModal({
                templateUrl: "delete.view.html",
                controllerAs: 'vm',
                controller: "DeletionController",
                inputs: {service: service}
            }).then(function (modal) {
                modal.element.modal();
                modal.close
                    .then(confirm => {
                        if (confirm) {
                            monitoringService.removeService(service);
                        }
                    })
                    .then(refresh);
            });
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
