angular.module('fg.geekstrap')

.directive('fgAutocomplete', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            options: '@list',
            getIcon: '&?icons',
            callback: '&',
            limit: '=?'
        },
        templateUrl: 'geekstrap/directives/autocomplete/autocomplete.html',
        link: function (scope, element, attrs) {
            var input = element.find('input');
            scope.selected = 0;
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

            scope.select = function (val) {
                if ('strict' in attrs && attrs.strict !== 'false') {
                    if (scope.suggestions.length) {
                        return scope.callback({
                            item: scope.suggestions[scope.selected]
                        });
                    }
                    return false;
                }
                return scope.callback({ item: val });
            };

            scope.showList = function () {
                return input.val() && scope.isFocused;
            };

            input.on('input', function (e) {
                var val = input.val();
                scope.suggestions = scope.autocomplete.filter(function (item) {
                    return scope.label(item).indexOf(val) === 0;
                });
                if (scope.limit) scope.suggestions.splice(scope.limit);
                scope.selected = 0;
                scope.$apply();
            });

            input.on('keydown', function (e) {
                var keyCode = e.which || e.keyCode;
                if (keyCode == 9 || keyCode == 40) {
                    e.preventDefault();
                    scope.selected = (scope.selected + 1) % scope.suggestions.length;
                    scope.$apply();
                } else if (keyCode == 38){
                    scope.selected = (scope.selected - 1) > -1 ?
                       scope.selected - 1 :
                       scope.suggestions.length - 1;
                    scope.$apply();
                }
            });

            input.on('focusout', function () {
                scope.selected = 0;
                scope.isFocused = false;
            });

            input.on('focusin', function (){
                scope.isFocused = true;
            });

            scope.itemHover = function (index) {
                scope.selected = index;
            };

            scope.itemClick = function (item) {
                scope.callback({ item: item });
                input.val('');
            };
        }
    };
});
