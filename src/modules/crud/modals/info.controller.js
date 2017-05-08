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
            vm.response = undefined;
        }

        function send() {
            crudService.send(request)
                .then(response => vm.response = response);
        }

        function exit() {
            close(null, 500);
        }
    }
})();
