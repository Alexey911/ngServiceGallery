(function () {

    angular.module('ngServiceGallery').component('crud', {
        templateUrl: 'crud.directive.html',
        bindings: {},
        controllerAs: 'vm',
        controller: crudCtrl
    });

    crudCtrl.$inject = ['NgTableParams', 'crudService', 'ModalService'];

    function crudCtrl(NgTableParams, crudService, ModalService) {
        var vm = this;
        vm.save = save;
        vm.reset = reset;
        vm.select = select;
        vm.remove = remove;
        vm.update = update;
        vm.status = status;
        vm.refresh = refresh;

        vm.$onInit = () => {
            crudService
                .configure()
                .then(data => {
                    vm.buttons = ['one', 'two'];
                    // translationService
                    //     .translate(data.custom.buttons)
                    //     .then(buttons => vm.buttons = buttons);
                })
                .then(refresh);
        };

        activate();

        function activate() {
            vm.items = new NgTableParams(
                {
                    count: 5
                },
                {
                    getData: search,
                    counts: [5, 10, 25],
                    paginationMinBlocks: 1,
                    paginationMaxBlocks: 5
                }
            );
            vm.items.metadata = undefined;
            vm.item = {id: undefined, name: ''};
            vm.buttons = {};
        }

        function select(item) {
            vm.item = angular.copy(item);
        }

        function status(item) {
            if (!item.data.disabled) return '';
            return '';//translationService.getCached('state.disabled');
        }

        function save(item) {

            ModalService.showModal({
                templateUrl: "components/yesno.html",
                controller: "YesNoController"
            }).then(function(modal) {
                modal.element.modal();
                modal.close.then(function(result) {
                    console.log('close');
                    // vm.yesNoResult = result ? "You said Yes" : "You said No";
                });
            });
            // crudService
            //     .save(item)
            //     .then(refreshAll)
                // .catch(onError);
        }

        function update(item) {
            crudService
                .update(item)
                .then(refreshAll)
                // .catch(onError);
        }

        function remove(item) {
            crudService
                .remove(item)
                .then(refreshAll)
                // .catch(onError);
        }

        function search(params) {
            return crudService
                .search(params)
                .then(updateMetadata)
                // .catch(onError);
        }

        function updateMetadata(data) {
            if (data.length == 0) return data;

            vm.items.metadata = data[0].metadata;
            return data;
        }

        function refresh() {
            vm.items.reload();
        }

        function refreshAll() {
            reset();

            /* The table has previous state in this place,
             if there's single item & current page isn't first - manual page changing.
             */
            if (vm.items.data.length === 1) {
                var currPage = vm.items.page();
                if (currPage > 0) {
                    vm.items.page(currPage - 1);
                }
            } else {
                vm.items.reload();
            }
        }

        function reset() {
            vm.item = {id: undefined, name: ''};
        }
    }
})();