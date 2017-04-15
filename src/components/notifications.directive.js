(function () {
    'use strict';

    angular
        .module('ngServiceGallery')
        .component('notifications', {
            templateUrl: 'notifications.directive.html',
            restrict: 'E',
            controllerAs: 'vm',
            controller: notificationCtrl,
        });

    notificationCtrl.inject = ['notificationService'];

    function notificationCtrl(notificationService) {
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
