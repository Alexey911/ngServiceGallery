(function () {
    angular
        .module('ngServiceGallery',
            [
                'ngServiceGallery.crud',
                'ngServiceGallery.monitoring'
            ])
        .run(startUp);

    startUp.inject = ['$log'];

    function startUp($log) {
        $log.info('ServiceGallery is running');
    }
})();
