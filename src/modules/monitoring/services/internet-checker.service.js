(function () {
    'use strict';

    angular
        .module('ngServiceGallery.monitoring')
        .factory('internetChecker', internetChecker);

    internetChecker.$inject = ['SERVICE_CONFIG', 'scheduler', 'notificationService', 'ping'];

    function internetChecker(SERVICE_CONFIG, scheduler, notificationService, ping) {

        let actor = undefined;
        let checker = undefined;

        return {
            start: start,
            stop: stop
        };

        function start(owner) {
            if (checker || !owner.isRunning()) return;

            actor = owner;
            checker = scheduler.schedule(checkAccess, 2500);
        }

        function checkAccess() {
            let test = new Image();
            test.onerror = notifyOnFail;
            test.src = SERVICE_CONFIG.TEST_SERVICE + ping.random();
        }

        function notifyOnFail() {
            if (actor.isRunning()) {
                notificationService.showMessage('NETWORK_FAIL');
                actor.stop();
                stop();
            }
        }

        function stop() {
            scheduler.stop(checker);
            actor = undefined;
            checker = undefined;
        }
    }
})();
