angular.module('fg.geekstrap')

/**
 * @ngdoc directive
 * @name fg.geekstrap.directive:fg-alias
 * @restrict A
 * @description
 * fg-alias works as a bridge between any directive declared within its own element and the parent scope. It exports anything within the controller's exports property to the target scope by overwriting the specified property.
 * ##Considerations
 * - fg-alias instantiates it's controller and it will **only** export it's own `this.exports` property to the parent scope.
 * - The `this.exports` property is already defined and it should **not** be redefined by any means.
 * - The whole ordeal happens when the directive links.
 * - If the target property is an array then instead of overwritting the directive will be pushed into it.
 *
 * ##Example
 * ```
// HTML
<my-directive fg-alias="myDirective"></my-directive>

// Directive Logic
link: function (scope, element, attrs, fgAliasCtrl) {
  fgAliasCtrl.exports.greet = function () { alert('Hello!'); };
}

// Parent scope
$scope.myDirective.greet();
 * ```
 */
.directive('fgAlias', function() {
  return {
    restrict:'A',
    controller: function() {
      this.exports = {};
    },
    link: function (scope, element, attrs, controller) {
      var target = scope.$parent[attrs.fgAlias];
      if (target instanceof Array) {
        controller.exports._index = target.length;
        target.push(controller.exports);
      } else {
        scope.$parent[attrs.fgAlias] = controller.exports;
      }
    }
  };
});
