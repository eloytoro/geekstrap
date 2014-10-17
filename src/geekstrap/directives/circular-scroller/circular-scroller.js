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
      <circular-scroller scroll="scroll" fg-alias="cscroller">
        <img src="img/logo_footer.png" style="width: 190px"></img>
      </circular-scroller>
      <button ng-click="doscroll(130)" class="hover-blue">left</button>
      <button ng-click="doscroll(-130)" class="hover-blue">right</button>
    </div>
  </file>
</example>
 */
.directive('circularScroller', ['$window', '$timeout', '$compile', function($window, $timeout, $compile) {
  return {
    restrict:'E',
    replace: true,
    transclude: true,
    templateUrl: 'geekstrap/directives/circular-scroller/circular-scroller.html',
    require: '?fgAlias',
    scope: {
      scroll: '=?'
    },
    link: function (scope, element, attrs, ctrl, transclude) {
      if (!ctrl) ctrl = {};

      var innerWidth = 0;
      var box = element[0].getElementsByClassName('fg-cscroller-box')[0];
      var offset = 0;
      var timeout;
      var overflowRight = 0;
      var overflowLeft = 0;

      ctrl.shown = [];
      ctrl.children = [];

      scope.boxStyle = {};

      if (!scope.scroll) scope.scroll = 0;

      transclude(scope.$parent, function(clone, scope) {
        for (var i = 0; i < clone.length; i++) {
          if (clone[i] instanceof Element)
            ctrl.children.push($compile(clone[i]));
        }
      });

      function insert (element) {
        innerWidth += element[0].offsetWidth;
        element.addClass('fg-cscroller-element');
        scope.boxStyle.width = innerWidth + 'px';
      }

      ctrl.append = (function (link) {
        return function () {
          ctrl.children[overflowRight]
          (scope.$parent, link);
        };
      })(function (clone) {
        overflowRight = (overflowRight + 1) % ctrl.children.length;
        ctrl.shown.push(clone);
        box.appendChild(clone[0]);
        insert(clone);
      });

      ctrl.prepend = (function (link) {
        return function () {
          ctrl.children[ctrl.children.length - overflowLeft - 1]
          (scope.$parent, link);
        };
      })(function (clone) {
        overflowLeft = (overflowLeft + 1) % ctrl.children.length;
        ctrl.shown.unshift(clone);
        box.insertBefore(clone[0], box.firstChild);
        insert(clone);
        offset += clone[0].offsetWidth;
        scope.boxStyle.left = -offset + 'px';
      });

      ctrl.pop = function () {
        var element = ctrl.shown.pop()[0];
        overflowRight = (overflowRight - 1 + ctrl.children.length) % ctrl.children.length;
        innerWidth -= element.offsetWidth;
        box.removeChild(element);
      };

      ctrl.shift = function () {
        var element = ctrl.shown.shift()[0];
        innerWidth -= element.offsetWidth;
        overflowLeft = (overflowLeft - 1 + ctrl.children.length) % ctrl.children.length;
        offset -= element.offsetWidth;
        scope.boxStyle.left = -offset + 'px';
        box.removeChild(element);
      };

      ctrl.build = function () {
        var outerWidth = element[0].offsetWidth;
        while (outerWidth > innerWidth - offset + scope.scroll)
          ctrl.append();
        while (offset - scope.scroll < 0)
          ctrl.prepend();
        scope.boxStyle.width = innerWidth + 'px';
        scope.boxStyle['margin-left'] = scope.scroll + 'px';
        if (timeout) { $timeout.cancel(timeout); }
        timeout = $timeout(ctrl.cleanup, 1000);
      };

      ctrl.cleanup = function () {
        var outerWidth = element[0].offsetWidth;
        while (outerWidth + ctrl.shown[ctrl.shown.length - 1][0].offsetWidth < innerWidth - offset + scope.scroll)
          ctrl.pop();
        while (offset - scope.scroll > ctrl.shown[0][0].offsetWidth)
          ctrl.shift();
        scope.boxStyle.width = innerWidth + 'px';
      };

      angular.element($window).bind('resize', function() {
        ctrl.build();
        scope.$apply();
      });

      scope.$watch('scroll', function (val) {
        ctrl.build();
      });
    }
  };
}]);
