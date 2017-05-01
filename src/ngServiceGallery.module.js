(function () {
    angular
        .module('ngServiceGallery',
            [
                'ngServiceGallery.crud',
                'ngServiceGallery.monitoring'
            ]);

    angular
        .module('ngServiceGallery')
        .provider('$gallery', $galleryProvider);

    $galleryProvider.$inject = [];

    function $galleryProvider() {
        this.$get = function () {
            return {};
        };
    }
})();
