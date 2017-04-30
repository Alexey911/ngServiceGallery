(function () {
    'use strict';

    angular
        .module('ngServiceGallery.monitoring')
        .constant('SERVICE_CONFIG', {
            "SPEED_PLACE": 'speeds',
            'STORAGE_PLACE': 'services',
            'SETTINGS_PLACE': 'settings',
            'DEFAULT_FREQUENCY': 2500,
            "DEFAULT_RESPONSE_SPEED": {
                "MIN": 65,
                "MAX": 5000,
                "FAST": 350,
                "SLOW": 3500,
                "MEDIUM": 1000
            },
            "TEST_SERVICE": 'http://gfx2.hotmail.com/mail/uxp/w4/m4/pr014/h/s7.png'
        });
})();
