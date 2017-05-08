(function () {
    'use strict';

    angular
        .module('ngServiceGallery.crud')
        .controller('EditRequestController', EditRequestController);

    EditRequestController.$inject = ['title', 'mode', 'request', 'close', '$scope', 'crudService', 'itemService'];

    function EditRequestController(title, mode, request, close, $scope, crudService, itemService) {

        let vm = this;

        vm.save = save;
        vm.cancel = cancel;
        vm.onParamChange = onParamChange;
        vm.onMethodChange = onMethodChange;
        vm.onContentTypeChange = onContentTypeChange;

        activate();

        function activate() {
            vm.title = title;
            vm.methods = crudService.methods();
            vm.dataTypes = crudService.dataTypes();
            vm.contentTypes = crudService.contentTypes();

            vm.request = (mode === 'create') ? requestTemplate() : request;

            itemService.extend(vm.request.params);
            itemService.extend(vm.request.headers);

            $scope.$watch('vm.request.params', itemService.onItemChange, true);
            $scope.$watch('vm.request.headers', itemService.onItemChange, true);
        }

        function requestTemplate() {
            return {
                url: '',
                name: '',
                params: [],
                headers: [],
                body: undefined,
                method: vm.methods[0]
            };
        }

        function cancel() {
            close(null, 500)
        }

        //TODO: temp solution
        function onParamChange(param) {
            param.value = (param.type === 'text') ? '' : 'file';
        }

        function onContentTypeChange() {
            vm.request.binaries = [];
            vm.request.body.pairs.forEach(param => param.type = 'text');
        }

        function onMethodChange(method) {
            if (method === 'GET') {
                vm.request.body = undefined;
            } else {
                vm.request.body = emptyBodyTemplate();
                itemService.extend(vm.request.body.pairs);
                $scope.$watch('vm.request.body.pairs', itemService.onItemChange, true);
            }
        }

        function save() {
            let request = {
                'url': vm.request.url,
                'name': vm.request.name,
                'method': vm.request.method,
                'params': itemService.filter(vm.request.params),
                'headers': itemService.filter(vm.request.headers),
                'body': makeBody()
            };
            close(request, 500);
        }

        function makeBody() {
            if (!vm.request.body) return;
            const data = vm.request.body;

            return {
                contentType: data.contentType,
                pairs: itemService.filter(data.pairs)
            };
        }

        function emptyBodyTemplate() {
            return {
                pairs: [],
                contentType: vm.contentTypes[0]
            }
        }
    }
})();

