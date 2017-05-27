(function () {
    'use strict';

    angular
        .module('ngServiceGallery.crud')
        .factory('serviceCoder', serviceCoder);

    serviceCoder.$inject = ['cryptService'];

    function serviceCoder(cryptService) {

        return {
            encode: encode,
            decode: decode
        };

        function encode(services) {
            let copy = angular.copy(services);

            for (let service of copy) {
                if (service.auth.type.value !== 'basic') continue;

                service.auth.data.password = cryptService.encrypt(service.auth.data.password, "123");
                service.auth.data.username = cryptService.encrypt(service.auth.data.username, "123");
            }
            return copy;
        }

        function decode(services) {
            let copy = angular.copy(services);

            for (let service of copy) {
                if (service.auth.type.value !== 'basic') continue;

                service.auth.data.password = cryptService.decrypt(service.auth.data.password, "123");
                service.auth.data.username = cryptService.decrypt(service.auth.data.username, "123");
            }
            return copy;
        }
    }
})();
