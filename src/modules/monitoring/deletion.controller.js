(function () {
    angular
        .module('ngServiceGallery')
        .controller('DeletionController', DeletionController);

    DeletionController.$inject = ['close', 'service'];

    function DeletionController(close, service) {
        let vm = this;

        vm.cancel = onCancel;
        vm.remove = remove;

        activate();

        function activate() {
            vm.service = service;
        }

        function onCancel() {
            close(false, 500)
        }

        function remove() {
            close(true, 500);
        }
    }
})();

