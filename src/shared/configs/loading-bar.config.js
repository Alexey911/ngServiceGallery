(function () {
    'use strict';

    angular
        .module('ngServiceGallery.common')
        .config(loadingBarConfig);

    loadingBarConfig.$inject = ['cfpLoadingBarProvider'];

    function loadingBarConfig(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeBar = true;
        cfpLoadingBarProvider.includeSpinner = true;
        cfpLoadingBarProvider.latencyThreshold = 100;
        cfpLoadingBarProvider.spinnerTemplate = '<div class="loading-bar-spinner"><div class="loading-bar-container"><i class="fa fa-cog fa-spin fa-3x fa-fw"></i><\/div><\/div>';
    }
})();
