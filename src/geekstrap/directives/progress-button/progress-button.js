angular.module('fg.geekstrap')

/**
 * @ngdoc directive
 * @name fg.geekstrap.directive:progress-button
 * @restrict E
 * @param {number=} model value within the scope that determines progress (from 0 to 100)
 * @param {function=} onload progress completion callback
 *
 * @description
 * A button that morphs into a loading bar whenever it's model value changes
 *
 * @example
<example module="app">
  <file name="index.html">
    <div ng-controller="BodyController" class="demo-pbutton">
      <progress-button model="progress" onload="onload()" class="hover-green" ng-click="doload()">
        click me
      </progress-button>
      <progress-button model="progress" onload="onload()" class="hover-blue" ng-click="doload()">
      click me
      </progress-button>
      <progress-button model="progress" onload="onload()" class="hover-red" ng-click="doload()">
      click me
      </progress-button>
    </div>
  </file>
</example>
 */
.directive('progressButton', function() {
    return {
        restrict:'E',
        replace: true,
        transclude: true,
        templateUrl: 'geekstrap/directives/progress-button/progress-button.html',
        scope: {
            model: '=',
            onload: '&'
        },
        controller: ['$scope', '$interval', '$timeout', function ($scope, $interval, $timeout) {
            var vm = this;
            $scope.isLoading = false;
            $scope.isFinishing = false;

            $scope.loadingBar = {
                width: '0px'
            };

            this.stopProgress = function() {
                $timeout(function() {
                    $scope.model = -1;
                }, 300);
                $scope.onload();
            };

            $scope.$watch('model', function(val) {
                $scope.isLoading = val >= 0;
                $scope.loadingBar.width = val + '%';
                if (val >= 100) {
                    vm.stopProgress();
                }
            });

        }],
        link: function (scope, element, attrs, controller) {
        }
    };
});
