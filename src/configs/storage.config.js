(function () {

    'use strict';

    angular
        .module('app')
        .config(setUpLocalStorage);

    setUpLocalStorage.inject = ['$localStorageProvider'];

    function setUpLocalStorage($localStorageProvider) {
        $localStorageProvider.setKeyPrefix('app-');
    }
})();
