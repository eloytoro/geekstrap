angular.module('geekstrap')

.directive('slider', ['$compile', function($compile) {
  return {
    restrict:'E',
    replace: true,
    transclude: true,
    templateUrl: 'src/geekstrap/templates/slider.html',
    scope: {
      scroll: '=?',
      speed: '=?'
    },
    controller: ['$scope', '$window', '$element', '$timeout', '$interval',
      function ($scope, $window, $element, $timeout, $interval) {

        var _this = this;
        var innerWidth = 0;
        var box = $element[0].getElementsByClassName('fg-slider-box')[0];
        $scope.boxStyle = {};
        $scope.wrapperStyle = {};
        var offset = 0;
        var timeout;
        var overflowRight = 0;
        var overflowLeft = 0;

        this.children = [];
        this.shown = [];

        if (!$scope.scroll) $scope.scroll = 0;
        if ($scope.speed) {
          $scope.scroll += $scope.speed;
          $interval(function () {
            $scope.scroll += $scope.speed;
          }, 1000);
        }

        function insert (element) {
          innerWidth += element[0].offsetWidth;
          element.addClass('fg-slider-element');
          $scope.boxStyle.width = innerWidth + 'px';
        }

        (function(link) {
          _this.append = function () {
            _this.children[overflowRight]
            ($scope.$parent, link);
          };
        })(function (clone, scope) {
          overflowRight = (overflowRight + 1) % _this.children.length;
          _this.shown.push(clone);
          box.appendChild(clone[0]);
          insert(clone);
        });

        (function(link) {
          _this.prepend = function () {
            _this.children[_this.children.length - overflowLeft - 1]
            ($scope.$parent, link);
          };
        })(function (clone, scope) {
          overflowLeft = (overflowLeft + 1) % _this.children.length;
          _this.shown.unshift(clone);
          box.insertBefore(clone[0], box.firstChild);
          insert(clone);
          offset += clone[0].offsetWidth;
          $scope.boxStyle.left = -offset + 'px';
        });

        _this.pop = function () {
          var element = _this.shown.pop()[0];
          overflowRight = overflowRight === 0 ? _this.children.length -1 : (overflowRight - 1) % _this.children.length;
          innerWidth -= element.offsetWidth;
          box.removeChild(element);
        };

        _this.shift = function () {
          var element = _this.shown.shift()[0];
          innerWidth -= element.offsetWidth;
          overflowLeft = overflowLeft === 0 ? _this.children.length - 1 : (overflowLeft - 1) % _this.children.length;
          offset -= element.offsetWidth;
          $scope.boxStyle.left = -offset + 'px';
          box.removeChild(element);
        };

        _this.build = function () {
          var outerWidth = $element[0].offsetWidth;
          while (outerWidth > innerWidth - offset + $scope.scroll)
            _this.append();
          while (offset - $scope.scroll < 0)
            _this.prepend();
          $scope.boxStyle.width = innerWidth + 'px';
          $scope.boxStyle['margin-left'] = $scope.scroll + 'px';
          if (timeout) { $timeout.cancel(timeout); }
          timeout = $timeout(_this.cleanup, 1000);
        };

        $scope.$watch('scroll', function (val) {
          _this.build();
        });

        _this.cleanup = function () {
          var outerWidth = $element[0].offsetWidth;
          while (outerWidth + _this.shown[_this.shown.length - 1][0].offsetWidth < innerWidth - offset + $scope.scroll)
            _this.pop();
          while (offset - $scope.scroll > _this.shown[0][0].offsetWidth)
            _this.shift();
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
