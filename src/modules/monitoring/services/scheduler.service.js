(function () {
    'use strict';

    angular
        .module('ngServiceGallery.monitoring')
        .factory('scheduler', scheduler);

    scheduler.$inject = ['$interval'];

    function scheduler($interval) {

        let nextScheduleId = 0;
        let schedulers = new Map();

        return {
            stop: stop,
            update: update,
            schedule: schedule,
            shutDown: shutDown,
            hasExecutor: hasExecutor
        };

        function schedule(task, frequency, count) {
            if (hasExecutor(task)) return;

            const executor = $interval(task, frequency, count);
            const scheduler = {
                task: task,
                count: count,
                executor: executor,
                frequency: frequency
            };

            const id = nextScheduleId++;
            schedulers.set(id, scheduler);

            return id;
        }

        function update(task, frequency) {
            if (hasExecutor(task) && schedulers.get(task).frequency !== frequency) {
                const settings = schedulers.get(task);
                stop(task);
                schedule(settings.task, frequency, settings.count);
            }
        }

        function shutDown() {
            for (let task of schedulers.keys()) stop(task);
        }

        function stop(task) {
            if (!task) return;
            
            const scheduler = schedulers.get(task);

            if (isRunning(scheduler.executor)) {
                $interval.cancel(scheduler.executor);
            }
        }

        function hasExecutor(task) {
            return schedulers.has(task) && isRunning(schedulers.get(task).executor);
        }

        function isRunning(executor) {
            return angular.isDefined(executor);
        }
    }
})();
