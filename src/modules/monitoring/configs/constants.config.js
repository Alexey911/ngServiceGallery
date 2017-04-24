(function () {
    'use strict';

    angular
        .module('ngServiceGallery.monitoring')
        .constant('SERVICE_CONFIG', {
            "SPEED_PLACE": 'speeds',
            'STORAGE_PLACE': 'services',
            'DEFAULT_FREQUENCY': 2500,
            "DEFAULT_RESPONSE_SPEED": {
                "MIN": 65,
                "MAX": 5000,
                "FAST": 350,
                "SLOW": 3500,
                "MEDIUM": 1000
            }
        });
})();
