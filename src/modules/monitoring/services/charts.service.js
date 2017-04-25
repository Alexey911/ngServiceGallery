(function () {
    'use strict';

    angular
        .module('ngServiceGallery.monitoring')
        .factory('charts', charts);

    charts.$inject = ['distributions', 'statistics', 'translationService'];

    function charts(distributions, statistics, translationService) {

        return {
            realTime: realTime,
            distribution: distribution
        };

        function realTime(service) {
            return new RealTimeChart(service, 10);
        }

        function distribution(service) {
            const chart = new DistributionChart(service, 10);
            chart.refresh();
            return chart;
        }

        function RealTimeChart(service, selection) {
            const STEP_SIZE = 10;
            const STEP_COUNT = 20;

            function grid() {
                const grid = [];

                for (let i = 0; i <= STEP_COUNT; i++) {
                    grid.push({x: STEP_SIZE * i, y: undefined});
                }
                return grid;
            }

            const statistic = statistics.getStatistics(service);

            this.dynamic = true;
            this.data = [grid()];
            this.series = ['response time'];
            this.datasetOverride = [{yAxisID: 'response'}, {xAxisID: 'time'}];

            let step = 0;
            const points = this.data[0];

            this.refresh = () => {
                if (step > STEP_COUNT) {
                    for (let i = 0; i < STEP_COUNT; i++) {
                        points[i].y = points[i + 1].y;
                    }
                }

                const last = statistic.history.length - 1;
                if (last < 0) return;

                const point = step <= STEP_COUNT ? step++ : STEP_COUNT;
                points[point].y = statistic.history[last].ping;

                statistic.expected = distributions.calculate(statistic, selection).expected;
            };

            this.options = {
                scales: {
                    yAxes: [
                        {
                            id: 'response',
                            type: 'linear',
                            display: true,
                            position: 'left',
                            scaleLabel: {
                                display: true,
                                labelString: responseTimeAxesTitle()
                            }
                        }
                    ],
                    xAxes: [
                        {
                            id: 'time',
                            type: 'linear',
                            display: false,
                            position: 'bottom',
                            ticks: {
                                min: 0,
                                max: STEP_COUNT * STEP_SIZE,
                                stepSize: STEP_SIZE
                            }
                        }
                    ]
                }
            };

            function fill(count) {
                let start = statistic.history.length - count - 1;
                if (start < 0) start = 0;

                for (let i = 0; i < count && i < statistic.history.length; ++i, ++step) {
                    points[step].y = statistic.history[start + i].ping;
                }
            }

            fill(STEP_COUNT);
        }

        function DistributionChart(service, selection) {
            const statistic = statistics.getStatistics(service);

            this.dynamic = false;
            this.data = [distributions.calculate(statistic, selection).distribution];
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

        function merge(target, source) {
            for (let i = 0; i < target.length; ++i) {
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
