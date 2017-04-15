(function () {
    'use strict';

    angular
        .module('ngServiceGallery')
        .config(setUpExceptionHandler);

    setUpExceptionHandler.inject = ['$provide'];

    function setUpExceptionHandler($provide) {
        $provide.decorator('$exceptionHandler', exceptionHandler);
    }

    exceptionHandler.inject = ['$log', '$delegate', '$injector'];

    function exceptionHandler($log, $delegate, $injector) {
        return (exception, cause) => {

            let notificationService = $injector.get('notificationService');
            notificationService.warn();

            $log.error('Exception[cause=%s]', cause);
            $delegate(exception, cause);
        };
    }
})();
