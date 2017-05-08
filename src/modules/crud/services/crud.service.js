(function () {
    'use strict';

    angular
        .module('ngServiceGallery.crud')
        .factory('crudService', crudService);

    crudService.$inject = ['$http', 'requestBuilder'];

    function crudService($http, requestBuilder) {

        return {
            send: send,
            methods: methods,
            dataTypes: dataTypes,
            contentTypes: contentTypes
        };

        function methods() {
            return ['GET', 'POST'];
        }

        function dataTypes() {
            return [
                {name: 'TEXT', value: 'text'},
                {name: 'FILE', value: 'file'}
            ];
        }

        function contentTypes() {
            return ['application/x-www-form-urlencoded', 'multipart/form-data'];
        }

        function send(data) {
            const request = requestBuilder.build(data);
            $http(request);
        }
    }
})();
