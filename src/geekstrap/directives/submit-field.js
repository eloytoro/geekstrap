angular.module('fg.geekstrap')

.directive('fgSubmitField', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            callback: '='
        },
        template: '<input type="text" class="fg-tag-input form-control"></input>',
        link: function (scope, element, attrs) {
            element.on('keydown', function (e) {
                if (e.which == 13) {
                    var val = element.val();

                    if (scope.callback(val))
                        element.val('');
                    scope.$apply();

                }
            });
        }
    };
});
