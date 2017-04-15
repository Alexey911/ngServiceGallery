(function () {
    'use strict';

    angular
        .module('ngServiceGallery')
        .config(setUpTranslations);

    setUpTranslations.inject = ['$translateProvider', '$localStorageProvider', 'TRANSLATION_CONFIG'];

    function setUpTranslations($translateProvider, $localStorageProvider, TRANSLATION_CONFIG) {
        const userLangKey = TRANSLATION_CONFIG.USER_LANGUAGE;
        const defaultLang = TRANSLATION_CONFIG.DEFAULT_LANGUAGE;
        const lang = $localStorageProvider.get(userLangKey) || defaultLang;

        $localStorageProvider.set(userLangKey, lang);

        $translateProvider.fallbackLanguage(lang);
        $translateProvider.preferredLanguage(lang);

        $translateProvider.useSanitizeValueStrategy('escape');
    }
})();
