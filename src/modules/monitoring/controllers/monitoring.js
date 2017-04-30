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

    MonitoringController.$inject = ['NgTableParams', 'pingService', 'statistics', 'serviceManager', 'painter', 'events'];

    function MonitoringController(NgTableParams, pingService, statistics, serviceManager, painter, events) {
        let vm = this;

        vm.stop = stop;
        vm.show = show;
        vm.edit = edit;
        vm.start = start;
        vm.force = force;
        vm.color = color;
        vm.remove = remove;
        vm.register = register;
        vm.settings = settings;

        activate();

        function activate() {
            vm.summary = statistics.getSummary();

            const services = serviceManager.getAll();

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
            services.forEach(statistics.register);
            services.forEach(pingService.register);

            events.registerBlur();
            events.registerFocus();
        }

        function start() {
            pingService.start();
        }

        function stop() {
            pingService.stop();
        }

        function settings() {
            serviceManager.configure();
        }

        function show(service) {
            serviceManager.show(service);
        }

        function force() {
            pingService.force();
        }

        function color(service) {
            return painter.color(service);
        }

        function edit(service) {
            serviceManager.edit(service)
                .then(pingService.reset)
                .then(statistics.reset)
                .then(refresh);
        }

        function remove(service) {
            serviceManager.remove(service)
                .then(pingService.remove)
                .then(statistics.remove)
                .then(refresh);
        }

        function register() {
            serviceManager.register()
                .then(statistics.register)
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
        }
    }
})();
