(function () {
    'use strict';

    angular
        .module('ngServiceGallery.crud')
        .controller('RequestInfoController', RequestInfoController);

    RequestInfoController.$inject = ['close', 'request', 'crudService'];

    function RequestInfoController(close, request, crudService) {
        let vm = this;

        vm.exit = exit;
        vm.send = send;

        activate();

        function activate() {
            vm.request = request;
        }

        function send() {
            crudService.send(request);
        }

        function exit() {
            close(null, 500);
        }
    }
})();
