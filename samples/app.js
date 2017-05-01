(function () {

    angular
        .module('app', ['ngServiceGallery'])
        .run(startUp);

    function startUp($log, $gallery) {
        let service = {
            name: 'test service',
            address: 'https://google.com',
            description: 'service example',
            settings: {frequency: 1500}
        };
        $gallery.setDefaultServices([service]);

        $log.info('App is running');
    }
})();
