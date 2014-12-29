angular.module('fg.geekstrap')

.directive('fgTagInput', function () {
    return {
        restrict: 'E',
        scope: {
            options: '@?autocomplete',
            tags: '='
        },
        templateUrl: 'geekstrap/directives/tag-field/tag-input.html',
        link: function (scope, element, attrs) {
            var input = element.find('input');
            var target = null;

            if (scope.options.match(/^\w+$/)) {
                scope.autocomplete = scope.$parent[scope.options].map(function (item) {
                    return {
                        label: item.label ? item.label : item,
                        object: item
                    };
                });
            } else {
                var match = scope.options.split(' ');
                if (match[1] === 'in' && match[2]) {
                    target = match[0];
                    scope.autocomplete = scope.$parent[match[2]].map(function (item) {
                        return {
                            label: item[target],
                            object: item
                        };
                    });
                } else {
                    target = 'label';
                }
            }

            scope.addTag = function (val) {
                if (
                    'strict' in attrs &&
                    attrs.strict !== 'false'
                ) {
                    if (scope.autocomplete.map(function (item) {
                        return item.label;
                    }).indexOf(val) < 0) {
                        return false;
                    } else {
                        scope.tags.push(selectedSuggestion.object);
                        return true;
                    }
                }
                if (scope.tags.indexOf(val) > -1) {
                    return true;
                }
                scope.tags.push(val);
                return true;
            };

            input.on('input', function (e) {
                scope.suggestions = scope.autocomplete.filter(function (item) {
                    return item.label.indexOf(input.val()) > -1;
                });
                selectedSuggestion = scope.suggestions[0];
                scope.$apply();
            });
        }
    };
});
