(function () {
    angular
        .module('ngServiceGallery')
        .controller('SettingsController', SettingsController);

    SettingsController.$inject = ['close', 'settings'];

    function SettingsController(close, settings) {
        let vm = this;

        vm.cancel = cancel;
        vm.update = update;

        activate();

        function activate() {
            vm.settings = settings.get();
        }

        function cancel() {
            close(null, 500);
        }

        function update() {
            settings.update(vm.settings);
            close(null, 500);
        }
    }
})();

