(function () {
    angular
        .module('ngServiceGallery')
        .controller('RegistrationController', RegistrationController);

    RegistrationController.$inject = ['$scope', 'close'];

    function RegistrationController(close) {
        let vm = this;

        vm.service = {};
        vm.cancel = onCancel;
        vm.register = register;

        function onCancel() {
            close(null, 500)
        }

        function register() {
            close(vm.service, 500);
        }
    }
})();

