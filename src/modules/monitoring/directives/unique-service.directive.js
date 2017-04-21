(function () {
    angular
        .module('ngServiceGallery.monitoring')
        .directive('uniqueService', uniqueService);

    uniqueService.$inject = ['monitoringService', '$stateParams'];

    function uniqueService(monitoringService, $stateParams) {

        let isValidServiceAddress = address => !monitoringService.isBusyAddress(address, $stateParams.owner);

        return {
            require: 'ngModel',
            restrict: 'A',
            link: function ($scope, element, attributes, ctrl) {
                ctrl.$validators.unique = isValidServiceAddress;
            }
        };
    }
})();
