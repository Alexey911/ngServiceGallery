(function () {
    'use strict';

    angular
        .module('ngServiceGallery.monitoring')
        .factory('painter', painter);

    painter.$inject = ['SERVICE_CONFIG'];

    function painter(SERVICE_CONFIG) {

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
            } else if (ping < SERVICE_CONFIG.FAST_SPEED) {
                return colors.green;
            } else if (ping < SERVICE_CONFIG.MEDIUM_SPEED) {
                return colors.orange;
            } else if (ping < SERVICE_CONFIG.SLOW_SPEED) {
                return colors.red;
            }

            return colors.red;
        }
    }
})();
