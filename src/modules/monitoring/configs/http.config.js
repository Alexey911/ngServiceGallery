(function () {
    'use strict';

    angular
        .module('ngServiceGallery.monitoring')
        .factory('responseTimeInjector', responseTimeInjector);

    responseTimeInjector.$inject = ['$q'];

    function responseTimeInjector($q) {
        const requests = new Map();

        return {
            request: function (config) {
                setUpRequestStart(config);
                return config;
            },
            response: function (response) {
                inject(response);
                return response;
            },
            responseError: function (response) {
                inject(response);
                return $q.reject(response);
            }
        };

        function setUpRequestStart(config) {
            requests.set(getRequestId(config), now());
        }

        function inject(response) {
            const id = getRequestId(response.config);
            const start = requests.get(id);

            response.config.responseTime = now() - start;
            response.config.contentLength = getContentLength(response);
            requests.delete(id);
        }

        function getRequestId(config) {
            return hashCode(config.method) ^ hashCode(config.url);
        }

        function now() {
            return performance.now();
        }

        function hashCode(s) {
            let h = 0;
            if (s.length > 0) {
                for (let i = 0; i < s.length; ++i) {
                    h = 31 * h + s.charAt(i);
                }
            }
            return h;
        }

        function getContentLength(response) {
            if (!response.data) return 0;

            const s = JSON.stringify(response.data);

            let count = s.length;
            for (let i = s.length - 1; i >= 0; i--) {
                let code = s.charCodeAt(i);

                if (code > 0x7f && code <= 0x7ff) {
                    count++;
                } else if (code > 0x7ff && code <= 0xffff) {
                    count += 2;
                }
            }
            return count;
        }
    }

    angular
        .module('ngServiceGallery.monitoring')
        .config(setUpInjector);

    setUpInjector.$inject = ['$httpProvider'];

    function setUpInjector($httpProvider) {
        $httpProvider.interceptors.push('responseTimeInjector');
    }
})();
