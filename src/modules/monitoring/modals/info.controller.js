(function () {
    angular
        .module('ngServiceGallery')
        .controller('ServiceInfoController', ServiceInfoController);

    ServiceInfoController.$inject = ['$scope', 'statistics', 'painter', 'translationService', 'distributions', 'service'];

    function ServiceInfoController($scope, statistics, painter, translationService, distributions, service) {
        let vm = this;

        activate();

        vm.color = painter.color;

        function activate() {
            vm.service = service;
            vm.statistics = statistics.getStatistics(service);

            drawChart();
            $scope.$watch('vm.statistics.avg', updateChart)
        }

        function drawChart() {
            let distribution = distributions.calculate(vm.statistics);

            vm.snapshot = {
                min: distribution.min,
                max: distribution.max
            };

            vm.labels = distribution.scale;
            vm.history = [distribution.frequencies];
            vm.series = [translationService.translate('FREQUENCY')];


            vm.datasetOverride = [{yAxisID: 'frequency'}, {xAxisID: 'response'}];
            vm.options = {
                scales: {
                    yAxes: [
                        {
                            id: 'frequency',
                            type: 'linear',
                            display: true,
                            position: 'left',
                            ticks: {min: 0},
                            scaleLabel: {
                                display: true,
                                labelString: frequencyAxesTitle()
                            }
                        }
                    ],
                    xAxes: [
                        {
                            id: 'response',
                            type: 'linear',
                            display: true,
                            position: 'bottom',
                            scaleLabel: {
                                display: true,
                                labelString: responseTimeAxesTitle()
                            }
                        }
                    ]
                }
            };
        }

        function updateChart() {
            let distribution = distributions.calculate(vm.statistics);

            if (distribution.min !== vm.snapshot.min || distribution.max !== vm.snapshot.max) {
                vm.labels = distribution.scale;
            }

            vm.snapshot = {min: distribution.min, max: distribution.max};

            for (let i = 0; i < 10; ++i) {
                vm.history[0][i] = distribution.frequencies[i];
            }
        }

        function frequencyAxesTitle() {
            return translationService.translate('FREQUENCY_AXES');
        }

        function responseTimeAxesTitle() {
            return translationService.translate('RESPONSE_TIME_AXES');
        }
    }
})();
