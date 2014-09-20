angular.module('geekstrap')

.directive('navbarTab', function() {
  return {
    restrict:'E',
    require: '^navbar',
    replace: true,
    transclude: true,
    templateUrl: 'src/geekstrap/templates/navbar-tab.html',
    scope: {
      link: '@'
    },
    link: function (scope, element, attrs, controller) {
      scope.width = $(element).width();
      scope.id = controller.addTab(scope);
      scope.refresh = function() {
        scope.width = $(element).width();
      };
      element.on('click', function() {
        controller.setActive(scope.id);
      });
    }
  };
});
