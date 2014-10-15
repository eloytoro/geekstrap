angular.module('fg.geekstrap')

/**
 * @ngdoc directive
 * @name fg.geekstrap.directive:circular-scroller
 * @restrict E
 * @param {number=} scroll value within the scope that determines the horizontal scrolling of the directive
 *
 * @description
 * Repeats the transcluded elements across the directive's width, simulating an infinite circular scroller
 * Rules:
 *  - Elements inside the scroller MUST have a fixed width
 *  - Directives inside the scroller can't use the ng-transclude directive, this is a known bug caused by angular's compile method not removing the property from already compiled directives
 *
 * @example
<example module="app">
  <file name="index.html">
    <div ng-controller="BodyController" class="demo-cscroller">
      <circular-scroller scroll="scroll">
        <img src="img/logo_footer.png" style="width: 190px"></img>
      </circular-scroller>
      <button ng-click="doscroll(130)" class="hover-blue">left</button>
      <button ng-click="doscroll(-130)" class="hover-blue">right</button>
    </div>
  </file>
</example>
 */
.directive('circularScroller', ['$compile', function($compile) {
  return {
    restrict:'E',
    replace: true,
    transclude: true,
    templateUrl: 'geekstrap/directives/circular-scroller/circular-scroller.html',
    scope: {
      scroll: '=?'
    },
    controller: ['$scope', '$window', '$element', '$timeout',
      function ($scope, $window, $element, $timeout) {

        var _this = this;
        var innerWidth = 0;
        var box = $element[0].getElementsByClassName('fg-cscroller-box')[0];
        var offset = 0;
        var timeout;
        var overflowRight = 0;
        var overflowLeft = 0;

        $scope.boxStyle = {};

        this.children = [];
        this.shown = [];

        if (!$scope.scroll) $scope.scroll = 0;

        function insert (element) {
          innerWidth += element[0].offsetWidth;
          element.addClass('fg-cscroller-element');
          $scope.boxStyle.width = innerWidth + 'px';
        }

        _this.append = (function (link) {
          return function () {
            _this.children[overflowRight]
            ($scope.$parent, link);
          };
        })(function (clone, scope) {
          overflowRight = (overflowRight + 1) % _this.children.length;
          _this.shown.push(clone);
          box.appendChild(clone[0]);
          insert(clone);
        });

        _this.prepend = (function (link) {
          return function () {
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
          overflowRight = (overflowRight - 1 + _this.children.length) % _this.children.length;
          innerWidth -= element.offsetWidth;
          box.removeChild(element);
        };

        _this.shift = function () {
          var element = _this.shown.shift()[0];
          innerWidth -= element.offsetWidth;
          overflowLeft = (overflowLeft - 1 + this.children.length) % _this.children.length;
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
          post: function (scope, element, attrs, controller, transclude) {
            scope.$watch('scroll', function (val) {
              controller.build();
            });
          }
        };
      }
  };
}]);
