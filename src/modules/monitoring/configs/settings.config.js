(function () {
    'use strict';

    angular
        .module('ngServiceGallery.monitoring')
        .value('RESPONSE_SPEED', {})
        .run(applySettings);

    applySettings.$inject = ['SERVICE_CONFIG', 'RESPONSE_SPEED', 'storageService'];

    function applySettings(SERVICE_CONFIG, RESPONSE_SPEED, storageService) {
        const speedKey = SERVICE_CONFIG.SPEED_PLACE;
        const defaultSettings = defaultSpeedSettings(SERVICE_CONFIG);
        const speed = storageService.get(speedKey, defaultSettings);

        merge(RESPONSE_SPEED, speed);
        storageService.save(speedKey, speed);
    }

    function merge(target, source) {
        target.FAST = source.FAST;
        target.SLOW = source.SLOW;
        target.MEDIUM = source.MEDIUM;
        target.UNKNOWN = source.UNKNOWN;
    }

    function defaultSpeedSettings(SERVICE_CONFIG) {
        return {
            UNKNOWN: -1,
            FAST: SERVICE_CONFIG.DEFAULT_RESPONSE_SPEED.FAST,
            SLOW: SERVICE_CONFIG.DEFAULT_RESPONSE_SPEED.SLOW,
            MEDIUM: SERVICE_CONFIG.DEFAULT_RESPONSE_SPEED.MEDIUM
        }
    }
})();
