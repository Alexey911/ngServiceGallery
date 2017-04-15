(function () {
    'use strict';

    angular
        .module('app')
        .config(setUpTranslations);

    setUpTranslations.inject = ['$translateProvider', '$localStorageProvider', 'TRANSLATION_CONFIG'];

    function setUpTranslations($translateProvider, $localStorageProvider, TRANSLATION_CONFIG) {
        let lang = $localStorageProvider.get(TRANSLATION_CONFIG.USER_LANGUAGE) || TRANSLATION_CONFIG.DEFAULT_LANGUAGE;

        $translateProvider.fallbackLanguage(lang);
        $translateProvider.preferredLanguage(lang);

        $translateProvider.useSanitizeValueStrategy('escape');

        $translateProvider.useStaticFilesLoader({prefix: 'langs/lang-', suffix: '.json'});
    }
})();
