(function () {
    angular
        .module('ngServiceGallery')
        .controller('RegistrationController', RegistrationController);

    RegistrationController.$inject = ['SERVICE_CONFIG', 'close'];

    function RegistrationController(SERVICE_CONFIG, close) {
        let vm = this;

        vm.cancel = onCancel;
        vm.submit = register;

        activate();

        function activate() {
            vm.service = {frequency: SERVICE_CONFIG.DEFAULT_FREQUENCY};
            vm.mode = 'register';
        }

        function onCancel() {
            close(null, 500)
        }

        function register() {
            close(vm.service, 500);
        }
    }
})();

