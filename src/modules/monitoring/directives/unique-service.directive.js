(function () {
    'use strict';

    angular
        .module('ngServiceGallery.monitoring')
        .directive('uniqueService', uniqueService);

    uniqueService.$inject = ['serviceManager', 'stateParams'];

    function uniqueService(serviceManager, stateParams) {

        let isValidServiceAddress = address => !serviceManager.isBusyAddress(address, stateParams.owner);

        return {
            require: 'ngModel',
            restrict: 'A',
            link: function ($scope, element, attributes, ctrl) {
                ctrl.$validators.unique = isValidServiceAddress;
            }
        };
    }
})();
