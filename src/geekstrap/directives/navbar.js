angular.module('geekstrap')

.directive('navbar', function() {
    return {
      restrict:'E',
      replace: true,
      transclude: true,
      templateUrl: 'src/geekstrap/templates/navbar.html',
      controller: ['$scope', '$window', function ($scope, $window) {
        this.tabs = [];
        var vm = this;

        $scope.caretOffset = {};
        $scope.activeTab = 0;

        this.moveCaret = function(id) {
          var offset = 0;
          for (var i = 0; i < id; i++) {
            offset += this.tabs[i].width;
          }
          $scope.caretOffset.left = offset + 'px';
          $scope.caretOffset.width = this.tabs[id].width + 'px';
        };

        this.setActive = function(id) {
          for (var key in this.tabs) {
            this.tabs[key].active = id == key;
          }
          $scope.activeTab = id;
          this.moveCaret(id);
          $scope.$digest();
        };

        this.addTab = function(tab) {
          var index = this.tabs.length;
          this.tabs[index] = tab;
          if (index == 0) {
            tab.active = true;
          }
          return index;
        };

        angular.element($window).bind('resize', function() {
          for (var key in vm.tabs) {
            vm.tabs[key].refresh();
          }
          vm.moveCaret($scope.activeTab);
          $scope.$digest();
        });

      }],
      link: function (scope, element, attrs, controller) {
        controller.moveCaret(0);
      }
    };
});
