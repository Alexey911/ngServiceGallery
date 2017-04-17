(function () {
    angular
        .module('ngServiceGallery')
        .controller('RegistrationController', RegistrationController);

    RegistrationController.$inject = ['close'];

    function RegistrationController(close) {
        let vm = this;

        vm.cancel = onCancel;
        vm.submit = register;

        activate();

        function activate() {
            vm.service = {};
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

