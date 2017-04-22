(function () {
    'use strict';

    angular
        .module('ngServiceGallery.monitoring')
        .constant('SERVICE_CONFIG', {
            'STORAGE_PLACE': 'services',
            'DEFAULT_FREQUENCY': 2500
        });
})();
