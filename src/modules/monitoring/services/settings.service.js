(function () {
    'use strict';

    angular
        .module('ngServiceGallery.monitoring')
        .factory('settings', settings);

    settings.$inject = ['SERVICE_CONFIG', 'RESPONSE_SPEED', 'PING_SETTINGS', 'storageService', 'notificationService'];

    function settings(SERVICE_CONFIG, RESPONSE_SPEED, PING_SETTINGS, storageService, notificationService) {

        return {
            get: get,
            update: update
        };

        function get() {
            return {
                fast: RESPONSE_SPEED.FAST,
                slow: RESPONSE_SPEED.SLOW,
                medium: RESPONSE_SPEED.MEDIUM,
                offline: PING_SETTINGS.OFFLINE
            }
        }

        function update(settings) {
            RESPONSE_SPEED.FAST = settings.fast;
            RESPONSE_SPEED.SLOW = settings.slow;
            RESPONSE_SPEED.MEDIUM = settings.medium;

            PING_SETTINGS.OFFLINE = settings.offline;

            storageService.save(SERVICE_CONFIG.SPEED_PLACE, RESPONSE_SPEED);
            storageService.save(SERVICE_CONFIG.SETTINGS_PLACE, PING_SETTINGS);

            notificationService.showMessage('COMPLETE_SETTINGS_UPDATE');
        }
    }
})();
