'use strict';

describe('common module', function () {
    beforeEach(module('ngServiceGallery.common'));

    describe('storage', function () {
        it('should save, load and remove', inject(function (storageService) {

            storageService.save('key', {data: 'some data'});
            expect(storageService.get('key').data).toEqual('some data');

            storageService.remove('key');
            expect(storageService.get('key', 'unknown')).toEqual('unknown');
        }));
    });
});
