(function () {
    'use strict';

    angular
        .module('ngServiceGallery.monitoring')
        .factory('charts', charts);

    charts.$inject = ['distributions', 'statistics', 'translationService'];

    function charts(distributions, statistics, translationService) {

        return {
            distribution: distribution
        };

        function distribution(service) {
            return new DistributionChart(service);
        }

        function DistributionChart(service) {
            const statistic = statistics.getStatistics(service);

            this.data = [distributions.calculate(statistic, 10)];
            this.series = [translationService.translate('FREQUENCY')];
            this.datasetOverride = [{yAxisID: 'frequency'}, {xAxisID: 'response'}];

            this.refresh = () => {
                merge(this.data[0], distributions.calculate(statistic, 10));
            };

            this.options = {
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
                                min: statistic.min
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

        function frequencyAxesTitle() {
            return translationService.translate('FREQUENCY_AXES');
        }

        function responseTimeAxesTitle() {
            return translationService.translate('RESPONSE_TIME_AXES');
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
    }
})();
