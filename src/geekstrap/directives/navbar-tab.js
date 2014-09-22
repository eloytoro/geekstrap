angular.module('geekstrap')

.directive('navbarTab', function() {
  return {
    restrict:'E',
    require: '^navbar',
    replace: true,
    transclude: true,
    templateUrl: 'src/geekstrap/templates/navbar-tab.html',
    scope: {
      link: '@',
      activable: '@'
    },
    link: function (scope, element, attrs, controller) {
      scope.width = $(element).width();
      scope.id = controller.addTab(scope);
      if (scope.activable != 'false') {
        element.on('click', function() {
          controller.setActive(scope.id);
        });
      }
      scope.refresh = function() {
        scope.width = $(element).width();
      };
    }
  };
});
