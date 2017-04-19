(function () {
    angular
        .module('ngServiceGallery')
        .controller('UpdateController', UpdateController);

    UpdateController.$inject = ['close', '$stateParams', 'service'];

    function UpdateController(close, $stateParams, service) {
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

