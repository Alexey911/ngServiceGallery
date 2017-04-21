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

        vm.show = show;
        vm.edit = edit;
        vm.force = force;
        vm.remove = remove;
        vm.register = register;
        vm.pause = pause;
        vm.start = start;
        vm.color = color;
        vm.$onInit = subscribeOnNotifications;

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
            vm.summary = undefined;
        }

        function subscribeOnNotifications() {
            monitoringService.setUp(refresh);
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

        function register() {
            monitoringService
                .register()
                .then(refresh);
        }

        function show(service) {
            monitoringService.show(service);
        }

        function remove(service) {
            monitoringService
                .remove(service)
                .then(refresh);
        }

        function edit(service) {
            monitoringService
                .edit(service)
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
            vm.summary = monitoringService.getCommonStatistic();
        }
    }
})();
