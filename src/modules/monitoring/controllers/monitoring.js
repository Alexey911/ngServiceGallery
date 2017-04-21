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

    MonitoringController.$inject = ['NgTableParams', 'monitoringService'];

    function MonitoringController(NgTableParams, monitoringService) {
        let vm = this;

        vm.stop = stop;
        vm.show = show;
        vm.edit = edit;
        vm.start = start;
        vm.force = force;
        vm.remove = remove;
        vm.register = register;

        activate();

        function activate() {
            vm.summary = undefined;

            vm.services = new NgTableParams(
                {
                    count: 5
                },
                {
                    counts: [5, 10, 25],
                    paginationMinBlocks: 1,
                    paginationMaxBlocks: 5,
                    dataset: monitoringService.getAll()
                }
            );

            monitoringService.subscribe(refresh)
        }

        function start() {
            monitoringService.start();
        }

        function stop() {
            monitoringService.stop();
        }

        function show(service) {
            monitoringService.show(service);
        }

        function force() {
            monitoringService.force();
        }

        function edit(service) {
            monitoringService
                .edit(service)
                .then(refresh);
        }

        function remove(service) {
            monitoringService
                .remove(service)
                .then(refresh);
        }

        function register() {
            monitoringService
                .register()
                .then(refresh);
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
            vm.summary = monitoringService.getSummary();
        }
    }
})();
