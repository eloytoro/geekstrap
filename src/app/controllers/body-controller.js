angular.module('app')

.controller('BodyController', ['$scope', '$interval', function ($scope, $interval) {
    $scope.bulletTooltip = "linkedin";

    $scope.onload = function() {
      $interval.cancel(this.interval);
      this.interval = undefined;
    };

    $scope.doload = function() {
      if (this.interval) return;
      $scope.progress = 0;
      this.interval = $interval(function(tick) {
        $scope.progress += 10;
      }, 200);
    }
}]);
