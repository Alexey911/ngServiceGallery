(function () {
    angular
        .module('app',
            [
                'ngTable',
                'ngStorage',
                'growlNotifications',
                'angularModalService',
                'angular-loading-bar',
                'pascalprecht.translate'
            ])
        .run(function ($log) {
            $log.info('App is running');
        });
})();
