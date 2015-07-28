/**
 * @ngdoc directive
 * @name up-content-folder.directive#upContentFolder
 * @description A container for either portlets or (recursively) other containers
 * @param {Object} def The display
 * @restrict E
 */

angular.module('up-content-folder')
    .directive('upContentFolder', function(RecursionHelper, Folder) {
        'use strict';

        return {
            templateUrl: Folder.templateUrl,
            scope: {
                def: '='
            },
            restrict: 'E',
            compile: function(tEle) {
                return RecursionHelper.compile(tEle, function link($scope, iEle, iAttrs) {
                    if ( $scope.def && $scope.def.display ) {
                        Folder.strategy($scope.def.display)($scope, iEle, iAttrs);
                        iEle.attr('up-display', $scope.def.display || Folder.defAttr('display'));
                    }
                });
            }
        };
    });
