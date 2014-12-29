angular.module('fg.geekstrap')

.directive('fgTagField', function () {
    return {
        restrict: 'A',
        scope: {
            fgTagField: '='
        },
        link: function (scope, element, attrs) {
            element.on('keydown', function (e) {
                if (e.which == 13) {
                    var val = element.val();

                    if (scope.fgTagField(val))
                        element.val('');
                    scope.$apply();

                }
            });
        }
    };
});
