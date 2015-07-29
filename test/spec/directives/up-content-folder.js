describe('up-content-folder directive', function() {
    'use strict';


    var testHandler = jasmine.createSpy('testHandler').and.callFake(function($scope) {
        $scope.hello = $scope.def.foo;
    });

    var barHandler = jasmine.createSpy('barHandler').and.callFake(function ($scope, iEle) {
        iEle.attr('foo', 'bar');
        $scope.whoa = 'man';
    });

    var fakeElement = '<up-content-folder def="foo">' +
        '<span>{{hello}}</span>' +
        '<up-content-folder ng-repeat="child in def.content" def="child"></up-content-folder>' +
    '</up-content-folder>';

    var fakeDoubleEle = '<up-content-folder def="foo">{{hello}}</up-content-folder>' +
        '<up-content-folder def="bar">{{whoa}}</up-content-folder>';

    var provider, scope;

    beforeEach(function() {
        var fakeMod = angular.module('test.content', function() {});

        fakeMod.config( function ( FolderProvider ) {
            provider = FolderProvider;
            provider.defaultAttrs = {};
            provider.displayStrategy('test', testHandler);
            provider.displayStrategy('bar', barHandler);
        });


        module('up-content-folder', 'test.content');

        inject(function(Folder, $compile, $rootScope) {
            scope = $rootScope.$new();

            scope.foo = {
                display: 'test',
                foo: 'bar',
                content: [{
                    display: 'test',
                    foo: 'baz',
                    content: []
                }]
            };

            scope.bar = {
                display: 'bar',
                content: []
            };

            fakeElement = $compile(fakeElement)(scope);
            fakeDoubleEle = $compile(fakeDoubleEle)(scope);
            scope.$digest();
        });
    });

    afterEach(function() {
        barHandler.calls.reset();
        testHandler.calls.reset();
    });

    describe('Compilation of up-content-folder', function() {
        it('should put scope in the child', function() {
            expect(fakeElement.text()).toEqual('barbaz');
            expect(fakeElement.children().eq(0).text()).toEqual('bar');
        });
    });

    describe('double element compilation', function() {
        it('should use each root element\'s own contained template', function() {
            expect(fakeDoubleEle.text()).toEqual('barman');
            expect(fakeDoubleEle.eq(1).attr('foo')).toEqual('bar');
        });

        it('should expose some child $scope as the first argument to handler functions', function() {
            expect(barHandler.calls.argsFor(0)[0].$parent).toBe(scope);
        });
    });
});
