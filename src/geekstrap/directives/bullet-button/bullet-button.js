angular.module('fg.geekstrap')

.directive('bullet', function() {
    return {
        restrict:'E',
        replace: true,
        transclude: true,
        templateUrl: 'geekstrap/directives/bullet-button/bullet-button.html',
        scope: {
            logo: '@'
        },
        controller: ['$scope', function($scope) {

        }],
        link: function (scope, element, attrs, controller) {
        }
    };
});
