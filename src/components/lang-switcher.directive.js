(function () {
    'use strict';

    angular
        .module('ngServiceGallery')
        .component('langSwitcher', {
            templateUrl: 'src/components/lang-switcher.directive.html',
            restrict: 'E',
            controllerAs: 'vm',
            controller: langSwitcherCtrl,
        });

    langSwitcherCtrl.inject = ['translationService'];

    function langSwitcherCtrl(translationService) {
        let vm = this;

        vm.languages = translationService.getLanguages();
        vm.lang = translationService.getDefaultLanguage();

        vm.changeLanguage = changeLanguage;

        function changeLanguage() {
            translationService.changeLanguage(vm.lang);
        }
    }
})();

