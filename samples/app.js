(function () {

    angular
        .module('app', ['ngServiceGallery'])
        .config(setUp)
        .run(startUp);

    setUp.$inject = ['$galleryProvider'];

    function setUp($galleryProvider) {
    }

    startUp.$inject = ['$log'];

    function startUp($log) {
        $log.info('App is running');
    }
})();
