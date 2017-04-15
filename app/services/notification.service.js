(function () {
    'use strict';

    angular
        .module('app')
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

            let notification = {id: lastMessageId++, message: message};

            subscribers.forEach(
                subscriber => subscriber.call(subscriber, notification)
            );
        }

        function warn() {
            let message = translationService.translate('WARN');
            showMessage(message);
        }
    }
})();
