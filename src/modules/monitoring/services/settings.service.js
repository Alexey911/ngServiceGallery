(function () {
    'use strict';

    angular
        .module('ngServiceGallery.monitoring')
        .factory('settings', settings);

    settings.$inject = ['SERVICE_CONFIG', 'RESPONSE_SPEED', 'storageService', 'notificationService'];

    function settings(SERVICE_CONFIG, RESPONSE_SPEED, storageService, notificationService) {

        return {
            get: get,
            update: update
        };

        function get() {
            return {
                fast: RESPONSE_SPEED.FAST,
                slow: RESPONSE_SPEED.SLOW,
                medium: RESPONSE_SPEED.MEDIUM
            }
        }

        function update(settings) {
            RESPONSE_SPEED.FAST = settings.fast;
            RESPONSE_SPEED.SLOW = settings.slow;
            RESPONSE_SPEED.MEDIUM = settings.medium;

            storageService.save(SERVICE_CONFIG.SPEED_PLACE, RESPONSE_SPEED);
            notificationService.showMessage('COMPLETE_SETTINGS_UPDATE');
        }
    }
})();
