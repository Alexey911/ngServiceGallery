(function () {
    angular
        .module('ngServiceGallery')
        .controller('registerCtrl', registerCtrl);

    registerCtrl.inject = ['$scope', 'close'];

    function registerCtrl(close) {
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

