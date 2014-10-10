angular.module('geekstrap')

.directive('slider', ['$compile', function($compile) {
  return {
    restrict:'E',
    replace: true,
    transclude: true,
    templateUrl: 'src/geekstrap/templates/slider.html',
    controller: ['$scope', '$window', '$element', function ($scope, $window, $element) {

      var _this = this;

      this.children = [];

      this.build = function() {
        var sliderWidth = 0, i = 0, width = $element[0].offsetWidth;
        this.shown = [];
        while (sliderWidth < width) {
          _this.children[i % _this.children.length]($scope, function(clonedElement, scope) {
            console.log(clonedElement[0]);
            $element[0].appendChild(clonedElement[0]);
            sliderWidth += clonedElement[0].offsetWidth;
          });
          i++;
        }
      };

      angular.element($window).bind('resize', function() {
        _this.build();
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
