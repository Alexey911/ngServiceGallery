(function () {
    'use strict';

    angular
        .module('ngServiceGallery.crud')
        .controller('EditRequestController', EditRequestController);

    EditRequestController.$inject = ['close', '$scope', 'crudService', 'itemService'];

    function EditRequestController(close, $scope, crudService, itemService) {

        let vm = this;

        vm.send = send;
        vm.cancel = cancel;
        vm.getFileName = getFileName;
        vm.onParamChange = onParamChange;
        vm.onMethodChange = onMethodChange;
        vm.onContentTypeChange = onContentTypeChange;

        activate();

        function activate() {
            vm.methods = crudService.methods();
            vm.dataTypes = crudService.dataTypes();
            vm.contentTypes = crudService.contentTypes();

            vm.request = {
                url: '',
                params: [],
                headers: [],
                body: undefined,
                binaries: {},
                method: vm.methods[0]
            };

            itemService.extend(vm.request.params);
            itemService.extend(vm.request.headers);
            $scope.$watch('vm.request.params', itemService.onItemChange, true);
            $scope.$watch('vm.request.headers', itemService.onItemChange, true);
        }

        function cancel() {
            close(null, 500)
        }

        //TODO: temp solution
        function onParamChange(param) {
            param.value = (param.type === 'text') ? '' : 'file';
        }

        function getFileName(pair) {
            const files = vm.request.binaries[pair.$$hashKey];
            return (files && files.length) ? files[0].name : 'BROWSE';
        }

        function onContentTypeChange() {
            for (let param of vm.request.body.pairs) param.type = 'text';
            vm.request.binaries = [];
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

        function send() {
            let request = {
                'url': vm.request.url,
                'method': vm.request.method,
                'params': itemService.filter(vm.request.params),
                'headers': itemService.filter(vm.request.headers),
                'body': makeBody()
            };

            crudService.send(request);
        }

        function makeBody() {
            if (!vm.request.body)  return;
            const data = vm.request.body;

            let body = {
                contentType: data.contentType,
                pairs: itemService.filter(data.pairs)
            };

            for (let pair of body.pairs) {
                if (pair.type === 'file') setUpFile(pair);
            }
            return body;
        }

        function setUpFile(pair) {
            const key = vm.request.body.pairs.find(p => p.name === pair.name).$$hashKey;

            const files = vm.request.binaries[key];
            pair.value = files && files.length && files[0];
        }

        function emptyBodyTemplate() {
            return {
                pairs: [],
                contentType: vm.contentTypes[0]
            }
        }
    }
})();

