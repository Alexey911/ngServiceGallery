(function () {
    'use strict';

    angular
        .module('ngServiceGallery.monitoring')
        .factory('events', events);

    events.$inject = ['PING_SETTINGS', 'pingService', 'notificationService', 'serviceManager'];

    function events(PING_SETTINGS, pingService, notificationService, serviceManager) {

        let wasRunning = false;

        return {
            registerBlur: registerBlur,
            registerFocus: registerFocus
        };

        function onBlur() {
            wasRunning = pingService.isRunning();
            if (isChangeRequired()) pingService.stop();
        }

        function registerBlur() {
            window.onblur = onBlur;
        }

        function onFocus() {
            if (!isChangeRequired()) return;

            pingService.start();
            notificationService.showMessage('WATCH_RESUMPTION');
        }

        function registerFocus() {
            window.onfocus = onFocus;
        }

        function isChangeRequired() {
            return !PING_SETTINGS.OFFLINE && wasRunning && serviceManager.getAll().length;
        }
    }
})();
