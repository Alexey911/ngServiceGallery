(function () {
    'use strict';

    angular
        .module('ngServiceGallery')
        .component('monitoring', {
            templateUrl: 'monitoring.directive.html',
            restrict: 'E',
            controllerAs: 'vm',
            controller: monitoringCtrl,
        });

    monitoringCtrl.inject = ['ModalService', 'NgTableParams', 'monitoringService'];

    function monitoringCtrl(ModalService, NgTableParams, monitoringService) {
        let vm = this;

        vm.add = add;
        vm.remove = remove;
        vm.select = select;
        vm.register = register;

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
            monitoringService.remove(service);
        }

        function getAll() {
            return monitoringService.getAll();
        }

        function select(service) {
            vm.service = service;
        }

        function register() {
            ModalService.showModal({
                templateUrl: "register.directive.html",
                controllerAs: 'vm',
                controller: "registerCtrl"
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {

                    console.log(result);
                });
            });
        }
    }
})();
