angular.module('fg.geekstrap')

/**
 * @ngdoc directive
 * @name fg.geekstrap.directive:bullet-button
 * @restrict E
 * @param {string=} logo Logo image's url
 *
 * @description
 * A rendition of bullet buttons with some eye candy animations included
 *
 * @example
<example module="app">
  <file name="index.html">
    <div ng-controller="BodyController">
      <bullet logo="img/linkedin-logo.png" class="hover-blue">LinkedIn</bullet>
    </div>
  </file>
</example>
 */
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
