(function () {
    'use strict';

    angular
        .module('ngServiceGallery.crud')
        .factory('requestBuilder', requestBuilder);

    requestBuilder.$inject = ['$httpParamSerializerJQLike'];

    function requestBuilder($httpParamSerializerJQLike) {

        return {
            build: build
        };

        function build(data) {
            const request = {
                url: data.url,
                method: data.method,
                headers: transformToFields(data.headers),
                params: transformToFields(data.params)
            };

            if (data.body) setUpBody(request, data.body);

            return request;
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
