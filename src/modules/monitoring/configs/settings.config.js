(function () {
    'use strict';

    angular
        .module('ngServiceGallery.monitoring')
        .value('RESPONSE_SPEED', {})
        .value('PING_SETTINGS', {})
        .run(applySettings);

    applySettings.$inject = ['SERVICE_CONFIG', 'RESPONSE_SPEED', 'PING_SETTINGS', 'storageService'];

    function applySettings(SERVICE_CONFIG, RESPONSE_SPEED, PING_SETTINGS, storageService) {
        const speedSettings = defaultSpeedSettings(SERVICE_CONFIG.DEFAULT_RESPONSE_SPEED);
        const speed = storageService.get(SERVICE_CONFIG.SPEED_PLACE, speedSettings);

        mergeSpeeds(RESPONSE_SPEED, speed);
        storageService.save(SERVICE_CONFIG.SPEED_PLACE, speed);

        const settings = storageService.get(SERVICE_CONFIG.SETTINGS_PLACE, {OFFLINE: true});
        mergeSettings(PING_SETTINGS, settings);

        storageService.save(SERVICE_CONFIG.SETTINGS_PLACE)
    }

    function mergeSpeeds(target, source) {
        target.FAST = source.FAST;
        target.SLOW = source.SLOW;
        target.MEDIUM = source.MEDIUM;
        target.UNKNOWN = source.UNKNOWN;
    }

    function mergeSettings(target, source) {
        target.OFFLINE = source.offline;
    }

    function defaultSpeedSettings(speeds) {
        return {
            UNKNOWN: 0,
            FAST: speeds.FAST,
            SLOW: speeds.SLOW,
            MEDIUM: speeds.MEDIUM
        }
    }
})();
