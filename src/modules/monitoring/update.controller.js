(function () {
    angular
        .module('ngServiceGallery')
        .controller('UpdateController', UpdateController);

    UpdateController.$inject = ['close', 'service', '$stateParams'];

    function UpdateController(close, service, $stateParams) {
        let vm = this;

        vm.cancel = onCancel;
        vm.submit = update;

        activate();

        function activate() {
            vm.service = service;
            vm.mode = 'editing';
            $stateParams.owner = service.address;
        }

        function onCancel() {
            exit(null);
        }

        function update() {
            exit(vm.service);
        }

        function exit(service) {
            $stateParams.owner = undefined;
            close(service, 500);
        }
    }
})();

