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
            let distribution = distributions.calculate(vm.statistics, 10);

            vm.history = [distribution];
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
                            ticks: {
                                min: vm.statistics.min,
                            },
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
            const updated = distributions.calculate(vm.statistics, 10);
            merge(vm.history[0], updated);
        }

        function merge(target, source) {
            for (let i = 0; i < source.length; ++i) {
                const o = target[i];
                const v = source[i];

                if (o.x !== v.x) {
                    o.x = v.x;
                    o.y = v.y;
                } else if (o.y !== v.y) {
                    o.y = v.y;
                }
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
