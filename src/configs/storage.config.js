(function () {
    'use strict';

    angular
        .module('ngServiceGallery')
        .config(setUpLocalStorage);

    setUpLocalStorage.inject = ['$localStorageProvider'];

    function setUpLocalStorage($localStorageProvider) {
        $localStorageProvider.setKeyPrefix('ngServiceGallery-');
    }
})();
