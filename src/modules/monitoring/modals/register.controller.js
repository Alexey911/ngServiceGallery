(function () {
    angular
        .module('ngServiceGallery')
        .controller('RegistrationController', RegistrationController);

    RegistrationController.$inject = ['close', 'MONITORING_CONFIG'];

    function RegistrationController(close, MONITORING_CONFIG) {
        let vm = this;

        vm.cancel = onCancel;
        vm.submit = register;

        activate();

        function activate() {
            vm.service = {frequency: MONITORING_CONFIG.DEFAULT_FREQUENCY};
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

