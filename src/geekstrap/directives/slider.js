angular.module('geekstrap')

.directive('slider', ['$compile', function($compile) {
  return {
    restrict:'E',
    replace: true,
    transclude: true,
    templateUrl: 'src/geekstrap/templates/slider.html',
    controller: ['$scope', '$window', '$element', function ($scope, $window, $element) {

      var _this = this;
      var innerWidth = 0;
      var box = $element[0].getElementsByClassName('fg-slider-box')[0];
      var maxHeight = 0;
      $scope.boxStyle = {};
      var offset = 0;

      this.children = [];
      this.shown = [];

      var append = function (clonedElement, scope) {
        box.appendChild(clonedElement[0]);
        innerWidth += clonedElement[0].offsetWidth;
        clonedElement.addClass('fg-slider-element');
        if (!_this.shown.length) {
          offset = innerWidth;
          $scope.boxStyle.left = -innerWidth + 'px';
        }
        maxHeight = clonedElement[0].offsetHeight > maxHeight ? clonedElement[0].offsetHeight : maxHeight;
        _this.shown.push(clonedElement);
      };

      this.build = function() {
        var outerWidth = $element[0].offsetWidth;
        while (innerWidth - offset < outerWidth) {
          _this.children[_this.shown.length % _this.children.length]($scope, append);
        }
        while (innerWidth - offset - _this.shown[_this.shown.length - 1][0].offsetWidth > outerWidth) {
          var element = _this.shown.pop()[0];
          innerWidth -= element.offsetWidth;
          box.removeChild(element);
        }
        $scope.boxStyle.height = maxHeight + 'px';
        $scope.boxStyle.width = innerWidth + 'px';
      };

      angular.element($window).bind('resize', function() {
        _this.build();
        $scope.$apply();
      });

    }],
    compile: function (element, attrs) {
      return {
        pre: function (scope, element, attrs, controller, transclude) {
          transclude(scope.$parent, function(clone, scope) {
            for (var i = 0; i < clone.length; i++) {
              if (clone[i] instanceof Element)
                controller.children.push($compile(clone[i]));
            }
          });
        },
        post: function(scope, element, attrs, controller) {
          controller.build();
        }
      };
    }
  };
}]);
