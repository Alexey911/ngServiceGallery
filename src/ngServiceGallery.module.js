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
        .run(startUp);

    startUp.inject = ['$log'];

    function startUp($log) {
        $log.info('ServiceGallery is running');
    }
})();
