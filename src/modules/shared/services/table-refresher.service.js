(function () {
    'use strict';

    angular
        .module('ngServiceGallery.common')
        .factory('tableRefresher', tableRefresher);

    tableRefresher.$inject = [];

    function tableRefresher() {

        return {
            refresh: refresh
        };

        function refresh(table) {
            /* The table has previous state in this place,
             if there's single item & current page isn't first - manual page changing.
             */
            if (table.data.length === 1) {
                let currPage = table.page();
                if (currPage > 1) {
                    table.page(currPage - 1);
                }
            }
            table.reload();
        }
    }
})();
