(function () {
    angular
        .module('ngServiceGallery')
        .controller('ServiceInfoController', ServiceInfoController);

    ServiceInfoController.$inject = ['$scope', 'statistics', 'painter', 'service', 'charts'];

    function ServiceInfoController($scope, statistics, painter, service, charts) {
        let vm = this;

        activate();

        function activate() {
            vm.service = service;
            vm.color = painter.color;
            vm.chart = charts.distribution(service);
            vm.statistics = statistics.getStatistics(service);

            $scope.$watch('vm.statistics.avg', vm.chart.refresh);
        }
    }
})();
