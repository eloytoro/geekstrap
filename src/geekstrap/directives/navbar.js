angular.module('geekstrap')

.directive('navbar', function() {
    return {
      restrict:'E',
      replace: true,
      transclude: true,
      templateUrl: 'src/geekstrap/templates/navbar.html',
      controller: ['$scope', function ($scope) {
        this.tabs = [];

        $scope.caretOffset = {};

        this.setActive = function(id) {
          for (var key in this.tabs) {
            this.tabs[key].active = id == key;
            this.tabs[key].$digest();
          }
          var tab = this.tabs[id];
          $scope.caretOffset.left = tab.offset + 'px';
          $scope.caretOffset.width = tab.width + 'px';
          $scope.$digest();
        };

        this.offset = 0;

        this.addTab = function(tab) {
          var index = this.tabs.length;
          this.tabs[index] = tab;
          if (index == 0) {
            $scope.caretOffset.left = '0px';
            $scope.caretOffset.width = tab.width;
            tab.active = true;
          }
          tab.offset = this.offset;
          this.offset += tab.width;
          return index;
        };

      }],
      link: function (scope, element, attrs, controller) {
      }
    };
});
