(function () {
    angular
        .module('ngServiceGallery',
            [
                'ngTable',
                'ngStorage',
                'growlNotifications',
                'angularModalService',
                'angular-loading-bar',
                'pascalprecht.translate'
            ])
        .run(function ($log) {
            $log.info('ServiceGallery is running');
        });
})();
