(function () {
    'use strict';

    angular
        .module('ngServiceGallery.common')
        .component('notifications', {
            templateUrl: 'notifications.directive.html',
            restrict: 'E',
            controllerAs: 'vm',
            controller: NotificationController,
        });

    NotificationController.inject = ['notificationService'];

    function NotificationController(notificationService) {
        let vm = this;

        vm.notifications = {};
        vm.add = add;

        vm.$onInit = subscribeToNotifications;

        function subscribeToNotifications() {
            notificationService.register(showNotification);
        }

        function add(message) {
            notificationService.showMessage(message);
        }

        function showNotification(notification) {
            vm.notifications[notification.id] = notification.message;
        }
    }
})();
