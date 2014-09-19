angular.module('geekstrap')

.directive('bullet', function() {
    return {
        restrict:'E',
        replace: true,
        transclude: true,
        templateUrl: 'src/geekstrap/templates/bullet-button.html',
        scope: {
            logo: '@'
        },
        controller: ['$scope', function($scope) {

        }],
        link: function (scope, element, attrs, controller) {
        }
    };
});
