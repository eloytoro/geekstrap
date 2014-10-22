angular.module('fg.geekstrap')

.directive('alert', function() {
    return {
        restrict:'E',
        replace: true,
        templateUrl: 'geekstrap/directives/alert/alert.html',
        scope: {
            cluster: '=model'
        },
        controller: ['$scope', '$timeout', function($scope, $timeout) {

            var vm = this;
            $scope.visible = false;

            this.destroy = function(index) {
                $scope.cluster.splice(index, 1);
            };

        }],
        controllerAs: 'controller',
        link: function (scope, element, attrs, controller) {
        }
    };
});
