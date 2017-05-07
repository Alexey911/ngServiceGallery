(function () {
    'use strict';

    angular
        .module('ngServiceGallery.crud')
        .factory('crudService', crudService);

    crudService.$inject = ['$http', '$httpParamSerializerJQLike'];

    function crudService($http, $httpParamSerializerJQLike) {

        return {
            methods: methods,
            send: send,
            contentTypes: contentTypes
        };

        function methods() {
            return ['GET', 'POST'];
        }

        function contentTypes() {
            return ['application/x-www-form-urlencoded'];
        }

        function send(request) {
            const headers = transformToFields(request.headers);

            const req = {
                url: request.url,
                headers: headers,
                method: request.method,
                params: transformToFields(request.params)
            };

            if (request.body) setUpBody(req, request.body);

            $http(req);
        }

        function setUpBody(request, body) {
            request.headers['Content-Type'] = body.contentType;
            request.data = $httpParamSerializerJQLike(transformToFields(body.pairs));
        }

        function transformToFields(items) {
            const result = {};

            for (let item of items) {
                result[item.name] = item.value;
            }
            return result;
        }
    }
})();
