(function () {
    'use strict';

    angular
        .module('ngServiceGallery.common')
        .factory('storageService', storageService);

    storageService.$inject = ['$log', '$localStorage'];

    function storageService($log, $localStorage) {

        return {
            get: get,
            save: save,
            reset: reset,
            remove: remove
        };

        function get(key, defaultValue) {
            let saved = $localStorage[key];
            let value = saved ? saved : defaultValue;
            $log.debug(`Data[key="${key}"] was loaded`);
            return angular.copy(value);
        }

        function save(key, value) {
            $localStorage[key] = angular.copy(value);
            $log.debug(`Data[key="${key}"] was saved`);
        }

        function remove(key) {
            $log.debug(`Data[key="${key}"] was removed`);
            delete $localStorage[key];
        }

        function reset(){
            $localStorage.$reset();
        }
    }
})();
