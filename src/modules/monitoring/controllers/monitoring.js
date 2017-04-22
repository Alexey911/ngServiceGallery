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

    MonitoringController.$inject = ['NgTableParams', 'pingService', 'monitoringService'];

    function MonitoringController(NgTableParams, pingService, monitoringService) {
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

            const services = monitoringService.getAll();

            vm.services = new NgTableParams(
                {
                    count: 5
                },
                {
                    counts: [5, 10, 25],
                    paginationMinBlocks: 1,
                    paginationMaxBlocks: 5,
                    dataset: services
                }
            );
            pingService.subscribe(refresh);
            services.forEach(pingService.register);
        }

        function start() {
            pingService.start();
        }

        function stop() {
            pingService.stop();
        }

        function show(service) {
            monitoringService.show(service);
        }

        function force(){
            pingService.force();
        }

        function edit(service) {
            monitoringService
                .edit(service)
                .then(pingService.reset)
                .then(refresh);
        }

        function remove(service) {
            monitoringService
                .remove(service)
                .then(pingService.remove)
                .then(refresh);
        }

        function register() {
            monitoringService
                .register()
                .then(pingService.register)
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
            vm.summary = pingService.getSummary();
        }
    }
})();
