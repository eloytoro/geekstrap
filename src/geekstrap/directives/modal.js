angular.module('geekstrap')

.directive('modal', function() {
  return {
    restrict:'E',
    replace: true,
    transclude: true,
    templateUrl: 'src/geekstrap/templates/modal.html',
    scope: {
      visible: '='
    }
  };
});
