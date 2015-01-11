angular.module('fg.geekstrap')

.directive('fgSubmitField', function () {
    return {
        restrict: 'A',
        replace: true,
        scope: {
            callback: '&fgSubmitField'
        },
        link: function (scope, element, attrs) {
            element.on('keydown', function (e) {
                if (e.which == 13) {
                    e.preventDefault();
                    var val = element.val();

                    if (scope.callback({ value: val }))
                        element.val('');
                    scope.$apply();

                }
            });
        }
    };
});
