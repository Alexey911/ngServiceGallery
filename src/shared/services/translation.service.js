(function () {
    'use strict';

    angular
        .module('ngServiceGallery.common')
        .factory('translationService', translationService);

    translationService.inject = ['$translate', 'storageService', 'TRANSLATION_CONFIG'];

    function translationService($translate, storageService, TRANSLATION_CONFIG) {
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
            storageService.save(TRANSLATION_CONFIG.USER_LANGUAGE, lang.key);
        }

        function getDefaultLanguage() {
            let key = storageService.get(TRANSLATION_CONFIG.USER_LANGUAGE);
            return languages.filter(language => language.key === key)[0];
        }
    }
})();
