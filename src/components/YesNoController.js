(function () {
    var app = angular.module('app');

    app.controller('YesNoController', ['$scope', 'close', 'notificationService', function($scope, close, notificationService) {

        $scope.close = function(result) {
            notificationService.showMessage('lol');
            close(result, 500); // close, but give 500ms for bootstrap to animate
        };

    }]);
})();