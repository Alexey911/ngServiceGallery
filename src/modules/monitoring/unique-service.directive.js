(function () {
    angular
        .module('ngServiceGallery.monitoring')
        .directive('uniqueService', uniqueService);

    uniqueService.inject = ['monitoringService'];

    function uniqueService(monitoringService) {
        let isUniqueServiceAddress = address => !monitoringService.isRegistered(address);

        return {
            require: 'ngModel',
            restrict: "A",
            link: function ($scope, element, attributes, ctrl) {
                if (ctrl) {
                    ctrl.$validators.unique = isUniqueServiceAddress;
                }
            }
        };
    }
})();
