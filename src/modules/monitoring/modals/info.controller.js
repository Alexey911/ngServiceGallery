(function () {
    angular
        .module('ngServiceGallery')
        .controller('ServiceInfoController', ServiceInfoController);

    ServiceInfoController.$inject = ['statistics', 'painter', 'service'];

    function ServiceInfoController(statistics, painter, service) {
        let vm = this;

        activate();

        vm.color = painter.color;

        function activate() {
            vm.service = service;
            vm.statistics = statistics.getStatistics(service);
        }
    }
})();
