(function () {
    'use strict';

    angular
        .module('ngServiceGallery.crud')
        .controller('RequestInfoController', RequestInfoController);

    RequestInfoController.$inject = ['close', 'request'];

    function RequestInfoController(close, request) {
        let vm = this;

        vm.exit = exit;

        activate();

        function activate() {
            vm.request = request;
        }

        function exit() {
            close(null, 500);
        }
    }
})();
