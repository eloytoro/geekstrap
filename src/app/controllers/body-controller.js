angular.module('app')

.controller('BodyController', ['$scope', '$interval', function ($scope, $interval) {
    $scope.bulletTooltip = "linkedin";

    $scope.scroll = 0;

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

    $scope.alerts = [];

    $scope.alert = function(text, type) {
      $scope.alerts.push({
        text: text,
        class: "hover-green"
      });
    };
    $scope.error = function(text, type) {
      $scope.alerts.push({
        text: text,
        class: "hover-red"
      });
    };

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
    };

    $scope.doscroll = function(val) {
      console.log($scope.cscroller);
      $scope.scroll += val;
    };

    $scope.warningModalShow = function(flag) {
      $scope.warningModalVisible = flag;
    };

}]);
