(function () {
    'use strict';

    angular
        .module('app')
        .factory('translationService', translationService);

    translationService.inject = ['$translate'/* 'storageService', 'TRANSLATION_CONFIG'*/];

    function translationService($translate /*storageService, TRANSLATION_CONFIG*/) {
        let languages = [
            {key: 'en', title: "English"},
            {key: 'ru', title: 'Русский'}
        ];

        return {
            translate: translate,
            getLanguages: getLanguages,
            changeLanguage: changeLanguage,
            getDefaultLanguage: getDefaultLanguage
        };

        function translate(message) {
            return $translate.instant(message);
        }

        function getLanguages() {
            return languages;
        }

        function changeLanguage(lang) {
            $translate.use(lang.key);
            // storageService.save(TRANSLATION_CONFIG.USER_LANGUAGE, lang.key);
        }

        function getDefaultLanguage() {
            return 'en';
            // return storageService.get(TRANSLATION_CONFIG.USER_LANGUAGE, TRANSLATION_CONFIG.DEFAULT_LANGUAGE);
        }
    }
})();
