(function () {
    'use strict';

    angular
        .module('ngServiceGallery.crud')
        .factory('crudService', crudService);

    crudService.$inject = [
        'CRUD_CONFIG',
        'serviceCoder',
        'storageService',
        'crudModals',
        'searchService',
        'requestBuilder',
        '$http',
        'notificationService',
        '$injector'
    ];

    function crudService(CRUD_CONFIG, serviceCoder, storageService, crudModals, searchService, requestBuilder, $http, notificationService, $injector) {

        let requests = undefined;

        return {
            send: send,
            show: show,
            edit: edit,
            isXml: isXml,
            remove: remove,
            getAll: getAll,
            create: create,
            methods: methods,
            dataTypes: dataTypes,
            getServices: getServices,
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
            requests = requests || serviceCoder.decode(storageService.get(CRUD_CONFIG.REQUEST_PLACE, []));
            return searchService.filter(settings, requests);
        }

        function show(request) {
            return crudModals.showSummary(request);
        }

        function create() {
            return crudModals.showCreateRequest()
                .then(save);
        }

        function edit(request) {
            return crudModals.showEditRequest(request)
                .then(modified => saveChanges(modified, request));
        }

        function saveChanges(source, original) {
            if (!source) return;

            original.url = source.url;
            original.name = source.name;
            original.auth = source.auth;
            original.body = source.body;
            original.method = source.method;
            original.params = source.params;
            original.headers = source.headers;

            storageService.save(CRUD_CONFIG.REQUEST_PLACE, serviceCoder.encode(requests));

            return original;
        }

        function save(request) {
            if (!request) return;

            requests.unshift(request);
            storageService.save(CRUD_CONFIG.REQUEST_PLACE, serviceCoder.encode(requests));
            return request;
        }

        function remove(request) {
            return crudModals.showRemove(request)
                .then(confirm => confirm && clean(request));
        }

        function clean(request) {
            let index = requests.indexOf(request);
            requests.splice(index, 1);

            storageService.save(CRUD_CONFIG.REQUEST_PLACE, serviceCoder.encode(requests));

            return request;
        }

        function send(data) {
            const request = requestBuilder.build(data);

            if (isAcceptedXML(request)) transformForXMLResponse(request);

            return $http(request).catch(notifyOnFail);
        }

        function transformForXMLResponse(request) {
            request.transformResponse = response => response;
        }

        function isAcceptedXML(request) {
            const accept = request.headers['Accept'];
            return accept && accept.indexOf('xml') >= 0
        }

        function notifyOnFail(response) {
            notificationService.showMessage("RESPONSE_FAIL");

            if (response.status === -1) response.status = 'UNKNOWN';
            return response;
        }

        function getServices() {
            const SERVICE_CONFIG = $injector.get('SERVICE_CONFIG');
            if (!SERVICE_CONFIG) return [];

            return storageService.get(SERVICE_CONFIG.STORAGE_PLACE);
        }

        function isXml(str) {
            return typeof str === 'string';
        }
    }
})();
