/**
 * @ngdoc directive
 * @name up-content-folder.directive#upContentFolder
 * @description A container for either portlets or (recursively) other containers
 * @param {Object} def The display definition, linked bidirectionally.
 * @scope
 * @restrict E
 */

angular.module('up-content-folder')
    .directive('upContentFolder', function(RecursionHelper, Folder, $compile) {
        'use strict';

        return {
            //Rather than an isolate scope, use a plain child scope.
            //This allows more-intuitive use of the given template
            scope: true,
            restrict: 'E',
            compile: function(tEle) {
                var tmpl = tEle.html();
                tEle.html('');

                return RecursionHelper.compile(tEle, function link($scope, iEle, iAttrs) {

                    //Manually add def to the scope and watch it for updates.
                    $scope.def = $scope.$eval(iAttrs.def);
                    $scope.$watch(iAttrs.def, function(d) {
                        $scope.def = d;
                    });

                    //TODO find a better place than the scope to store this.
                    $scope.$$$tmpl = $scope.$parent.$$$tmpl || tmpl;

                    iEle.html($scope.$$$tmpl);
                    $compile(iEle.contents())($scope);

                    if ( $scope.def && $scope.def.display ) {
                        iEle.attr('up-display', $scope.def.display);
                        Folder.strategy($scope.def.display)($scope, iEle, iAttrs);
                    } else {
                        //Employ default strategy if no display attribute found
                        Folder.strategy()($scope, iEle, iAttrs);
                        iEle.attr('up-display', Folder.defaultAttr('display'));
                    }
                });
            }
        };
    });
