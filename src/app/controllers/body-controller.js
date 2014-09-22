angular.module('app')

.controller('BodyController', ['$scope', '$interval', function ($scope, $interval) {
    $scope.bulletTooltip = "linkedin";

    $scope.sidebarItems = [{
      icon: 'anchor',
      title: '1'
    }, {
      icon: 'cloud',
      title: '2'
    }, {
      icon: 'compass',
      title: '3',
      onclick: function() {
        $scope.sidebarItems = [{
          icon: 'child',
          title: '4'
        }, {
          icon: 'eraser',
          title: '5'
        }];
      }
    }];

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

    $scope.setPeek = function(val) {
      $scope.peek = val;
    }

    $scope.peek = '0px';
}]);
