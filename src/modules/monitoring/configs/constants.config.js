(function () {
    'use strict';

    angular
        .module('ngServiceGallery.monitoring')
        .constant('SERVICE_CONFIG', {
            'STORAGE_PLACE': 'services',
            'DEFAULT_FREQUENCY': 2500,
            "FAST_SPEED": 350,
            "SLOW_SPEED": 3500,
            "MEDIUM_SPEED": 1000
        });
})();
