(function () {
    'use strict';

    angular
        .module('ngServiceGallery.monitoring')
        .factory('ping', ping);

    ping.$inject = ['$http'];

    function ping($http) {

        return {
            send: send,
            random: random
        };

        function random() {
            return '?random-no-cache=' + Math.floor((1 + Math.random()) * 0x10000).toString(16);
        }

        function getResponseTime(response) {
            return response.config.responseTime;
        }

        function send(url) {
            return $http.get(url + random()).then(getResponseTime, getResponseTime);
        }
    }
})();
