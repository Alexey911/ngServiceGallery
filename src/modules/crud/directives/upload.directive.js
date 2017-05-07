(function () {
    'use strict';

    angular
        .module('ngServiceGallery.crud')
        .directive('upload', upload);

    upload.$inject = [];

    function upload() {
        return {
            require: 'ngModel',
            link: function postLink(scope, elem, attrs, ngModel) {
                elem.on('change', function () {
                    const files = elem[0].files;
                    ngModel.$setViewValue(files);
                })
            }
        }
    }
})();
