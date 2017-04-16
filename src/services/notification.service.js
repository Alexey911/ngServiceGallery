(function () {
    'use strict';

    angular
        .module('ngServiceGallery')
        .factory('notificationService', notificationService);

    notificationService.inject = ['translationService'];

    function notificationService(translationService) {

        let subscribers = [];
        let lastMessageId = 0;

        return {
            warn: warn,
            register: register,
            showMessage: showMessage
        };

        function register(subscriber) {
            subscribers.push(subscriber);
        }

        function showMessage(message) {
            if (!message) return;

            let localized = translationService.translate(message);
            let notification = {id: lastMessageId++, message: localized};

            subscribers.forEach(
                subscriber => subscriber.call(subscriber, notification)
            );
        }

        function warn() {
            showMessage('WARN');
        }
    }
})();
