(function () {
    'use strict';

    angular
        .module('ngServiceGallery.monitoring')
        .factory('charts', charts);

    charts.$inject = ['$log', 'distributions', 'statistics', 'translationService'];

    //TODO: change chart update on independent timer (e.g, after each 1 sec)
    function charts($log, distributions, statistics, translationService) {

        return {
            realTime: realTime,
            distribution: distribution
        };

        function realTime(service) {
            return new RealTimeChart(service);
        }

        function distribution(service) {
            return new DistributionChart(service);
        }

        function RealTimeChart(service) {
            const STEP_COUNT = 20;
            const STEP_SIZE = 10;
            const EXPECTED_WITHIN = getSelection(service, STEP_COUNT);

            function grid() {
                const grid = new Array(STEP_COUNT);

                for (let i = 0; i <= STEP_COUNT; i++) {
                    grid[i] = ({x: STEP_SIZE * i, y: undefined});
                }
                return grid;
            }

            const statistic = statistics.getStatistics(service);

            this.dynamic = true;
            this.data = [grid()];
            this.series = [translationService.translate('RESPONSE_TIME')];
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

                statistic.expected = distributions.getExpected(statistic, EXPECTED_WITHIN);
            };

            this.options = {
                scales: {
                    yAxes: [
                        {
                            id: 'response',
                            type: 'linear',
                            display: true,
                            position: 'left',
                            ticks: {min: 0},
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
                                max: STEP_SIZE * STEP_COUNT,
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

        function DistributionChart(service) {
            const POINT_COUNT = 10;
            const SELECTION_COUNT = getSelection(service, POINT_COUNT);

            const statistic = statistics.getStatistics(service);

            this.dynamic = false;
            this.data = [distributions.calculate(statistic, SELECTION_COUNT, POINT_COUNT).distribution];
            this.series = [responseTime()];
            this.datasetOverride = [{yAxisID: 'frequency'}, {xAxisID: 'response'}];

            this.refresh = () => {
                const data = distributions.calculate(statistic, SELECTION_COUNT, POINT_COUNT);
                merge(this.data[0], data.distribution);

                statistic.expected = distributions.getExpected(statistic, SELECTION_COUNT);

                let ticks = this.options.scales.xAxes[0].ticks;

                const error = (data.max - data.min) * 0.15;

                if (Math.abs(ticks.min - data.min) > error) ticks.min = data.min;
                if (Math.abs(ticks.max - data.max) > error) ticks.max = data.max;
            };

            this.options = {
                scales: {
                    yAxes: [
                        {
                            id: 'frequency',
                            type: 'linear',
                            display: true,
                            position: 'left',
                            ticks: {
                                min: 0,
                                max: 100
                            },
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
                                min: 0,
                                max: 300
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

        function getSelection(service, minAvailable) {
            const selection = 4000 / service.settings.frequency;
            const result = Math.floor(Math.max(selection, minAvailable));

            $log.info(`selection within ${result} last values`);
            return result;
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

        function responseTime() {
            return translationService.translate('FREQUENCY');
        }

        function frequencyAxesTitle() {
            return translationService.translate('FREQUENCY_AXES');
        }

        function responseTimeAxesTitle() {
            return translationService.translate('RESPONSE_TIME_AXES');
        }
    }
})();
