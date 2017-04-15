(function () {
    'use strict';

    angular
        .module('ngServiceGallery')
        .factory('storageService', storageService);

    storageService.inject = ['$log', '$localStorage'];

    function storageService($log, $localStorage) {

        return {
            get: get,
            save: save,
            remove: remove
        };

        function get(key, defaultValue) {
            let saved = $localStorage[key];
            let value = saved ? saved : defaultValue;
            $log.debug(`Data[key="${key}", default="${defaultValue}"] was loaded with value="${value}"`);
            return value;
        }

        function save(key, value) {
            $localStorage[key] = value;
            $log.debug(`Data[key="${key}", value="${value}"] was saved`);
        }

        function remove(key) {
            $log.debug(`Data[key="${key}"] was removed`);
            delete $localStorage[key];
        }
    }
})();