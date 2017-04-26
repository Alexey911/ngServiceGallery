(function () {
    angular
        .module('ngServiceGallery')
        .controller('ConfirmController', ConfirmController);

    ConfirmController.$inject = ['close', 'title', 'message', 'data'];

    function ConfirmController(close, title, message, data) {
        let vm = this;

        vm.cancel = cancel;
        vm.confirm = confirm;

        activate();

        function activate() {
            vm.title = title;
            vm.data = data;
            vm.message = message;
        }

        function cancel() {
            close(false, 500)
        }

        function confirm() {
            close(true, 500);
        }
    }
})();

