(function () {
    'use strict';

    angular
        .module('ngServiceGallery.monitoring')
        .factory('painter', painter);

    painter.$inject = ['RESPONSE_SPEED'];

    function painter(RESPONSE_SPEED) {

        const colors = {
            red: {color: "red"},
            green: {color: "green"},
            orange: {color: "orange"}
        };

        return {
            color: color
        };

        function color(ping) {
            if (ping === RESPONSE_SPEED.UNKNOWN) {
                return colors.red;
            } else if (ping < RESPONSE_SPEED.FAST) {
                return colors.green;
            } else if (ping < RESPONSE_SPEED.MEDIUM) {
                return colors.orange;
            } else if (ping < RESPONSE_SPEED.SLOW) {
                return colors.red;
            }

            return colors.red;
        }
    }
})();
