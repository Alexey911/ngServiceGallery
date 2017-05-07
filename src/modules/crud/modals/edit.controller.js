(function () {
    'use strict';

    angular
        .module('ngServiceGallery.crud')
        .controller('EditRequestController', EditRequestController);

    EditRequestController.$inject = ['$scope', 'crudService', 'itemService'];

    function EditRequestController($scope, crudService, itemService) {

        let vm = this;

        vm.send = send;
        vm.onMethodChange = onMethodChange;

        activate();

        function activate() {
            vm.methods = crudService.methods();
            vm.contentTypes = crudService.contentTypes();

            vm.request = {
                url: '',
                params: [],
                headers: [],
                body: undefined,
                method: vm.methods[0],
            };

            itemService.extend(vm.request.params);
            itemService.extend(vm.request.headers);
            $scope.$watch('vm.request.params', itemService.onItemChange, true);
            $scope.$watch('vm.request.headers', itemService.onItemChange, true);
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
            const body = vm.request.body;

            if (body)  return {
                contentType: body.contentType,
                pairs: itemService.filter(body.pairs),
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

