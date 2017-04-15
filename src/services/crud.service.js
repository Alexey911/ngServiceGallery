(function () {

    angular
        .module('app')
        .factory('crudService', crudService);

    crudService.$inject = [
        '$http', '$q'
    ];

    function crudService($http, $q) {
        var api = null;

        return {
            save: save,
            remove: remove,
            update: update,
            search: search,
            findAll: findAll,
            configure: configure,
        };

        function configure() {
            return $http.get(/*config.component.path +*/ 'crud.json').then(response => {
                var data = response.data;
                api = /*config.context +*/ data.url + '/';
                return data;
            });
        }

        function save(item) {
            return $http.post(api, item).then(response => item.id = response.data);
        }

        function update(item) {
            return $http.put(api, item);
        }

        function remove(item) {
            return $http.delete(api + item.id);
        }

        function search(params) {
            if (!api) return $q(resolve => resolve([]));

            var page = params.page() - 1;
            var size = params.count();

            return $http.get(api + 'search', {params: {page: page, size: size, sort: "date,DESC"}})
                .then(response => {
                    var data = response.data;
                    params.total(data.totalElements);
                    return data.content;
                });
        }

        function findAll() {
            return $http.get(api).then(response => response.data);
        }
    }
})();