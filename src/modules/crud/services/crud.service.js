(function () {
    'use strict';

    angular
        .module('ngServiceGallery.crud')
        .factory('crudService', crudService);

    crudService.$inject = ['CRUD_CONFIG', '$http', 'requestBuilder', 'storageService', 'crudModals'];

    function crudService(CRUD_CONFIG, $http, requestBuilder, storageService, crudModals) {

        let requests = undefined;

        return {
            send: send,
            remove: remove,
            getAll: getAll,
            create: create,
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

        function getAll() {
            requests = requests || storageService.get(CRUD_CONFIG.REQUEST_PLACE, []);
            return requests;
        }

        function create() {
            return crudModals.showCreateRequest()
                .then(save);
        }

        function save(request) {
            if (!request) return;

            requests.unshift(request);
            storageService.save(CRUD_CONFIG.REQUEST_PLACE, requests);
            return request;
        }

        function remove(request) {
            return crudModals.showRemove(request)
                .then(confirm => confirm && clean(request));
        }

        function clean(request) {
            let index = requests.indexOf(request);
            requests.splice(index, 1);

            storageService.save(CRUD_CONFIG.REQUEST_PLACE, requests);

            return request;
        }

        function send(data) {
            const request = requestBuilder.build(data);
            $http(request);
        }
    }
})();
