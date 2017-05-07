(function () {
    'use strict';

    angular
        .module('ngServiceGallery.crud')
        .factory('crudService', crudService);

    crudService.$inject = ['$http', '$httpParamSerializerJQLike'];

    function crudService($http, $httpParamSerializerJQLike) {

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

        function send(request) {
            const req = {
                url: request.url,
                method: request.method,
                headers: transformToFields(request.headers),
                params: transformToFields(request.params)
            };

            if (request.body) setUpBody(req, request.body);

            $http(req);
        }

        function setUpBody(request, body) {
            if (body.contentType === 'multipart/form-data') {
                request.headers['Content-Type'] = undefined;
                request.data = transformToForm(body.pairs);
            } else {
                request.headers['Content-Type'] = body.contentType;
                request.data = $httpParamSerializerJQLike(transformToFields(body.pairs));
            }
        }

        function transformToFields(items) {
            const result = {};

            for (let item of items) {
                result[item.name] = item.value;
            }
            return result;
        }

        function transformToForm(items) {
            let form = new FormData();

            for (let item of items) {
                form.append(item.name, item.value);
            }
            return form;
        }
    }
})();
