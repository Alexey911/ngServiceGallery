(function () {
    'use strict';

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
        this.$get = gallery;
    }

    gallery.$inject = ['serviceManager'];

    function gallery(serviceManager) {
        return {
            setDefaultServices: setDefaultServices
        };

        function setDefaultServices(services) {
            if (!serviceManager.getAll().length) {
                services.forEach(serviceManager.save);
            }
        }
    }
})();
