(function () {
    'use strict';

    angular
        .module('ngServiceGallery.common')
        .config(setUpLocalStorage);

    setUpLocalStorage.inject = ['$localStorageProvider'];

    function setUpLocalStorage($localStorageProvider) {
        $localStorageProvider.setKeyPrefix('ngServiceGallery-');
    }
})();
