(function () {
    'use strict';

    angular
        .module('ngServiceGallery.common')
        .component('localeSwitcher', {
            templateUrl: 'locale-switcher.html',
            restrict: 'E',
            controllerAs: 'vm',
            controller: LangSwitcherController,
        });

    LangSwitcherController.$inject = ['translationService'];

    function LangSwitcherController(translationService) {
        let vm = this;

        vm.languages = translationService.getLanguages();
        vm.lang = translationService.getDefaultLanguage();

        vm.changeLanguage = changeLanguage;

        function changeLanguage() {
            translationService.changeLanguage(vm.lang);
        }
    }
})();
