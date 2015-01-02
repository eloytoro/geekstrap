angular.module('fg.geekstrap')

.directive('fgTagInput', function () {
    return {
        restrict: 'E',
        scope: {
            options: '@?autocomplete',
            tags: '=',
            getIcon: '=?icons',
            limit: '=?'
        },
        templateUrl: 'geekstrap/directives/tag-field/tag-input.html',
        link: function (scope, element, attrs) {
            var input = element.find('input');
            scope.select = 0;
            scope.getIcon = scope.getIcon || function (item) {
                return 'fa-angle-double-right';
            };
            scope.label = function (item) { return item; };

            if (scope.options.match(/^\w+$/)) {
                scope.autocomplete = scope.$parent[scope.options];
            } else {
                var match = scope.options.split(' ');
                if (match[1] === 'from' && match[2]) {
                    scope.label = function (item) {
                        return item[match[0]];
                    };
                    scope.autocomplete = scope.$parent[match[2]];
                }
            }

            scope.addTag = function (val) {
                if ('strict' in attrs && attrs.strict !== 'false') {
                    if (scope.suggestions.length) {
                        if (scope.tags
                            .map(scope.label)
                            .indexOf(scope.label(scope.suggestions[scope.select])) > -1) {
                            return true;
                        }
                        scope.tags.push(scope.suggestions[scope.select]);
                        return true;
                    }
                    return false;
                }
                if (scope.tags.indexOf(val) > -1) {
                    return true;
                }
                scope.tags.push(val);
                return true;
            };

            scope.splice = function (index) {
                scope.tags.splice(index, 1);
            };

            scope.showList = function () {
                return input.val() && scope.isFocused;
            };

            input.on('input', function (e) {
                var val = input.val();
                var labels = scope.tags.map(scope.label);
                scope.suggestions = scope.autocomplete.filter(function (item) {
                    return scope.label(item).indexOf(val) > -1 && labels.indexOf(scope.label(item)) < 0;
                });
                if (scope.limit) scope.suggestions.splice(scope.limit);
                scope.select = 0;
                scope.$apply();
            });

            input.on('keydown', function (e) {
                var keyCode = e.which || e.keyCode;
                if (keyCode == 9 || keyCode == 40) {
                    e.preventDefault();
                    scope.select = (scope.select + 1) % scope.suggestions.length;
                    scope.$apply();
                } else if (keyCode == 38){
                    scope.select = (scope.select - 1) > -1 ?
                       scope.select - 1 :
                       scope.suggestions.length - 1;
                    scope.$apply();
                }
            });

            input.on('focusout', function () {
                scope.select = 0;
                scope.isFocused = false;
            });

            input.on('focusin', function (){
                scope.isFocused = true;
            });

            scope.itemHover = function (index) {
                scope.select = index;
            };

            scope.itemClick = function (item) {
                scope.tags.push(item);
                input.val('');
            };
        }
    };
});
