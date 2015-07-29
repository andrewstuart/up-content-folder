describe('up-content-folder service', function() {

    function testHandler () {};

    var provider, folder;

    beforeEach(function() {
        var fakeMod = angular.module('test.content', function() {});

        fakeMod.config( function ( FolderProvider ) {
            provider = FolderProvider;
            provider.defaultAttrs = {};
        });


        module('up-content-folder', 'test.content');

        inject(function($injector) {
            folder = $injector.get('Folder');
        });

    });

    describe('defaultAttrs', function() {
        it('should be exposed on the provider', function() {
            expect(provider.defaultAttrs).toBeDefined();
        });

        it('should affect the return value of service.defaultAttr', function() {
            expect(folder.defaultAttr('foo')).not.toBeDefined();
            provider.defaultAttrs.foo = 'bar';
            expect(folder.defaultAttr('foo')).toEqual('bar');
        });

    });

    describe('strategy and defaultHandler', function() {
        ['foo', 'bar', 'baz', 'bang', 'whatever'].forEach(function(v) {
            it('should return defaultHandler for unconfigured ' + v, function() {
                expect(folder.strategy(v)).toEqual(provider.defaultHandler);
            });
        });

        it('should return the default handler or a configured handler', function() {
            expect(folder.strategy('test')).toEqual(provider.defaultHandler);
            provider.displayStrategy('test', testHandler);
            expect(folder.strategy('test')).not.toEqual(provider.defaultHandler);
            expect(folder.strategy('test')).toEqual(testHandler);
        });
    });
});
