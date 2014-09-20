angular.module('geekstrap')

.directive('alert', function() {
  return {
    restrict:'E',
    replace: true,
    templateUrl: 'src/geekstrap/templates/alert.html',
    scope: {
      trigger: '='
    },
    controller: ['$scope', '$timeout', function($scope, $timeout) {

      var vm = this;
      $scope.visible = false;

      $scope.cluster = [];

      this.destroy = function(index) {
        $scope.cluster.splice(index, 1);
      };

      this.create = function(message) {
        var alert = {
          message: message
        };
        $scope.cluster.push(alert);
      };

      $scope.trigger = this.create;
    }],
    controllerAs: 'controller',
    link: function (scope, element, attrs, controller) {
    }
  };
});
