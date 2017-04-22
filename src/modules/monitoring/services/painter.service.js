(function () {
    'use strict';

    angular
        .module('ngServiceGallery.monitoring')
        .factory('painter', painter);

    painter.$inject = [];

    function painter() {

        const colors = {
            red: {color: "red"},
            green: {color: "green"},
            orange: {color: "orange"}
        };

        return {
            color: color
        };

        function color(service) {
            let ping = service.ping;

            if (ping === -1) {
                return colors.red;
            } else if (ping < 350.0) {
                return colors.green;
            } else if (ping < 1000.0) {
                return colors.orange;
            } else if (ping < 2000.0) {
                return colors.red;
            }

            return colors.red;
        }
    }
})();
