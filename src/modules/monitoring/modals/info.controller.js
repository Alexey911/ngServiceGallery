(function () {
    angular
        .module('ngServiceGallery')
        .controller('ServiceInfoController', ServiceInfoController);

    ServiceInfoController.$inject = ['service'];

    function ServiceInfoController(service) {
        let vm = this;

        activate();

        function activate() {
            vm.service = service
        }
    }
})();

