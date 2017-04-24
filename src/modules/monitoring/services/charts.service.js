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
            const chart = new DistributionChart(service, 10);
            chart.refresh();
            return chart;
        }

        function DistributionChart(service, selection) {
            const statistic = statistics.getStatistics(service);

            this.data = [[]];
            this.series = [translationService.translate('FREQUENCY')];
            this.datasetOverride = [{yAxisID: 'frequency'}, {xAxisID: 'response'}];

            this.refresh = () => {
                const data = distributions.calculate(statistic, selection);
                merge(this.data[0], data.distribution);

                statistic.expected = data.expected;

                let ticks = this.options.scales.xAxes[0].ticks;
                ticks.min = statistic.min;
                ticks.max = statistic.max;
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
                                min: statistic.min,
                                max: statistic.max
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
            const same = Math.min(target.length, source.length);

            for (let i = 0; i < same; ++i) {
                const o = target[i];
                const v = source[i];

                if (o.x !== v.x) {
                    o.x = v.x;
                    o.y = v.y;
                } else if (o.y !== v.y) {
                    o.y = v.y;
                }
            }

            for (let i = same; i < source.length; ++i) {
                target[i] = source[i];
            }

            if (target.length > source.length) {
                target.splice(source.length, target.length - source.length);
            }
        }
    }
})();
