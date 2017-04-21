(function () {
    'use strict';

    angular
        .module('ngServiceGallery.monitoring')
        .constant("MONITORING_CONFIG", {
            "SERVICES": "services",
            "DEFAULT_FREQUENCY": 2500
        });
})();
