(function () {
    'use strict';

    angular
        .module('ngServiceGallery.crud')
        .factory('crudService', crudService);

    crudService.$inject = ['CRUD_CONFIG', 'storageService', 'crudModals', 'searchService'];

    function crudService(CRUD_CONFIG, storageService, crudModals, searchService) {

        let requests = undefined;

        return {
            send: send,
            show: show,
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

        function getAll(settings) {
            requests = requests || storageService.get(CRUD_CONFIG.REQUEST_PLACE, []);
            return searchService.filter(settings, requests);
        }

        function show(request) {
            return crudModals.showSummary(request);
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
