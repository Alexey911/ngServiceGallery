(function () {
    'use strict';

    angular
        .module('ngServiceGallery.common')
        .factory('scheduler', scheduler);

    scheduler.$inject = ['$log', '$interval'];

    function scheduler($log, $interval) {

        let nextScheduleId = 1;
        let schedulers = new Map();

        return {
            stop: stop,
            update: update,
            schedule: schedule,
            shutDown: shutDown,
            hasExecutor: hasExecutor
        };

        function schedule(task, frequency, count) {
            const executor = $interval(task, frequency, count);

            if (count === 1) return;

            const scheduler = {
                task: task,
                count: count,
                executor: executor,
                frequency: frequency
            };

            const id = nextScheduleId++;
            schedulers.set(id, scheduler);

            $log.debug(`Task[id=${id},frequency=${frequency}] was started`);

            return id;
        }

        function update(task, frequency) {
            if (!hasExecutor(task)) return undefined;
            if (schedulers.get(task).frequency === frequency) return task;

            const settings = schedulers.get(task);
            stop(task);
            return schedule(settings.task, frequency, settings.count);
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

            schedulers.delete(task);

            $log.debug(`Task[id=${task}] was stopped`);
        }

        function hasExecutor(task) {
            return schedulers.has(task) && isRunning(schedulers.get(task).executor);
        }

        function isRunning(executor) {
            return angular.isDefined(executor);
        }
    }
})();
