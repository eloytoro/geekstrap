angular.module('geekstrap')

.directive('progressButton', function() {
  return {
    restrict:'E',
    replace: true,
    transclude: true,
    templateUrl: 'src/geekstrap/templates/progress-button.html',
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
