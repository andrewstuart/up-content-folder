angular.module('up-content-folder', ['RecursionHelper']);

/**
 * @ngdoc directive
 * @name up-content-folder.directive#upContentFolder
 * @description A container for either portlets or (recursively) other containers
 * @param {Object} def The display
 * @restrict E
 */

angular.module('up-content-folder')
    .directive('upContentFolder', ["RecursionHelper", "Folder", "$compile", function(RecursionHelper, Folder, $compile) {
        'use strict';

        return {
            scope: {
                def: '='
            },
            restrict: 'E',
            compile: function(tEle) {
                var tmpl = tEle.html();
                tEle.html('');

                return RecursionHelper.compile(tEle, function link($scope, iEle, iAttrs) {
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
    }]);

angular.module('up-content-folder')
    .provider('Folder', function() {
        'use strict';

        var PROV_NAME = 'Folder';
        var fProv = this;

        /**
         * @ngdoc
         * @propertyOf upContentFolder.provider:Folder
         * @name upContentFolder.provider:Folder#defaultAttrs
         * @description The default attributes that should be assigned to each
         * up-content-folder if not provided by the "def" object.
         */
        fProv.defaultAttrs = {};

        /**
         * @ngdoc
         * @propertyOf upContentFolder.provider:Folder
         * @name upContentFolder.provider:Folder#defaultHandler
         * @description A default handler function. Unless configured
         * explicitly, it will be a noop.
         */
        fProv.defaultHandler = function() {};

        var handlers = {};
        /**
         * @ngdoc
         * @methodOf upContentFolder.provider:Folder
         * @name upContentFolder.provider:Folder#displayStrategy
         * @param {String} displayType the display type to handle.
         * @param {Function} [strategy] The optional function that will be invoked on the
         * creation of an element with the provided displayType. The function
         * will be called as if a link function, with params $scope, iEle, iAttrs.
         * @returns {Function} The strategy for the given type.
         * @description Allows consumers to set their own display strategy
         * functions for a given display type.
         */
        fProv.displayStrategy = function(displayType, strategy) {
            if ( handlers[displayType] ) {
                console.warn(PROV_NAME +
                             ': handler for display type ' +
                             displayType +
                             ' is being overridden.');
            }

            return (handlers[displayType] = strategy);
        };

        //Constructor for actual ContentFolder
        function FolderService() {
            var cf = this;

            /**
             * @ngdoc
             * @methodOf upContentFolder.service:Folder
             * @name upContentFolder.service:Folder#defaultAttr
             * @param {String} attrName The name of the attribute to look up
             * @returns {String} The attribute value for the given attribute
             * name
             * @description Returns the default attribute value as set by
             * configuration if defined.
             */

            cf.defaultAttr = function(attrName) {
                return fProv.defaultAttrs[attrName];
            };

            /**
             * @ngdoc
             * @methodOf upContentFolder.service:Folder
             * @name upContentFolder.service:Folder#strategy
             * @param {String} displayType The display type for which to
             * retrieve a handler
             * @returns {Function} The handler for a given display type.
             * @description Returns the stategy function for the provided
             * display type.
             */

            cf.strategy = function(displayType) {
                return handlers[displayType] || fProv.defaultHandler;
            };
        }

        fProv.$get = function() {
            return new FolderService();
        };
    });
