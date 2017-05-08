(function () {
    'use strict';

    angular
        .module('ngServiceGallery.common')
        .factory('searchService', searchService);

    searchService.$inject = [];

    function searchService() {

        return {
            filter: filter
        };

        function filter(table, data) {
            const selection = search(table, data);

            table.total(selection.length);

            return selection.slice(
                (table.page() - 1) * table.count(),
                table.page() * table.count()
            );
        }

        function search(table, data) {
            const filter = table.filter();
            const selection = [];

            for (let item of data) {
                let acceptable = true;

                for (let fieldName in filter) {
                    acceptable = item[fieldName].indexOf(filter[fieldName]) >= 0;
                }
                if (acceptable) {
                    selection.push(item);
                }
            }
            return selection;
        }
    }
})();
