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
        vm.getFileName = getFileName;

        activate();

        function activate() {
            vm.request = request;
            vm.response = undefined;
        }

        function send() {
            setUpFiles();

            crudService.send(vm.request)
                .then(response => vm.response = response);
        }

        function getFileName(files) {
            return files && files.length && files[0].name || 'BROWSE';
        }

        function setUpFiles() {
            if (!vm.request.body) return;

            for (let pair of vm.request.body.pairs) {
                if (pair.type === 'file' && !pair.value.name) {
                    pair.value = pair.value[0];
                }
            }
        }

        function exit() {
            close(null, 500);
        }
    }
})();
