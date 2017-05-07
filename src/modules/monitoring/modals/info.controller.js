(function () {
    'use strict';

    angular
        .module('ngServiceGallery.monitoring')
        .controller('ServiceInfoController', ServiceInfoController);

    ServiceInfoController.$inject = ['$scope', 'close', 'statistics', 'painter', 'service', 'charts'];

    function ServiceInfoController($scope, close, statistics, painter, service, charts) {
        let vm = this;

        vm.drawChart = drawChart;
        vm.exit = exit;

        activate();

        function activate() {
            vm.chart = {};
            vm.service = service;
            vm.color = painter.color;
            vm.statistics = statistics.getStatistics(service);

            drawChart(true);
            $scope.$on('$destroy', () => vm.refresher());
        }

        function drawChart(realTime) {
            const chart = vm.chart;

            if (realTime) {
                if (!vm.chart.dynamic) vm.chart = charts.realTime(service);
            } else {
                if (vm.chart.dynamic) vm.chart = charts.distribution(service);
            }

            if (chart !== vm.chart) {
                if (vm.refresher) vm.refresher();
                vm.refresher = $scope.$watch('vm.statistics.commonTime', vm.chart.refresh);
            }
        }

        function exit() {
            close(null, 500);
            vm.closed = true;
        }
    }
})();
