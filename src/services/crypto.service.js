(function () {
    'use strict';

    angular
        .module('ngServiceGallery')
        .factory('cryptService', cryptService);

    cryptService.inject = [];

    function cryptService() {

        return {
            encrypt: encrypt,
            decrypt: decrypt
        };

        function encrypt(message, key) {
            return CryptoJS.AES.encrypt(message, key).toString();
        }

        function decrypt(message, key) {
            return CryptoJS.AES.decrypt(message, key).toString(CryptoJS.enc.Utf8);
        }

    }
})();