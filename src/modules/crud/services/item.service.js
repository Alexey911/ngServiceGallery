(function () {
    'use strict';

    angular
        .module('ngServiceGallery.crud')
        .factory('itemService', itemService);

    itemService.$inject = [];

    function itemService() {

        return {
            extend: extend,
            filter: filter,
            onItemChange: onItemChange
        };

        function onItemChange(curr, prev) {
            let free = [];
            let hasChanges = false;

            for (let i = 0; i < curr.length; i++) {
                let param = curr[i];
                if (isEmpty(param)) free.push(param);
                if (!areEqual(prev[i], curr[i])) hasChanges = true;
            }

            if (hasChanges && !free.length) {
                extend(curr);
            }
            if (curr.length > 1 && free.length > 1) {
                remove(curr, free[0]);
            }
        }

        function isEmpty(item) {
            return !item.name && !item.value;
        }

        function areEqual(a, b) {
            return a && a.name === b.name && a.value === b.value;
        }

        function extend(items) {
            const item = {
                name: "",
                value: undefined
            };

            items.push(item);
        }

        function remove(items, item) {
            items.splice(items.indexOf(item), 1);
        }

        function filter(items) {
            return items.filter(item => !isEmpty(item));
        }
    }
})();
