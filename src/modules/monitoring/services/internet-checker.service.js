(function () {
    'use strict';

    angular
        .module('ngServiceGallery.monitoring')
        .factory('internetChecker', internetChecker);

    internetChecker.$inject = ['SERVICE_CONFIG', 'scheduler', 'pingService', 'notificationService', 'ping'];

    function internetChecker(SERVICE_CONFIG, scheduler, pingService, notificationService, ping) {

        let checker = undefined;

        return {
            start: start,
            stop: stop
        };

        function start() {
            checker = scheduler.schedule(checkAccess, 2500);
        }

        function checkAccess() {
            let test = new Image();
            test.onerror = notifyOnFail;
            test.src = SERVICE_CONFIG.TEST_SERVICE + ping.random();
        }

        function notifyOnFail() {
            if (pingService.isRunning()) {
                notificationService.showMessage('NETWORK_FAIL');
                pingService.stop();
            }
        }

        function stop() {
            scheduler.stop(checker);
            checker = undefined;
        }
    }
})();
