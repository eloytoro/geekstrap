angular.module('fg.geekstrap')

.directive('modal', function() {
  return {
    restrict:'E',
    replace: true,
    transclude: true,
    templateUrl: 'geekstrap/directives/modal/modal.html',
    scope: {
      visible: '='
    }
  };
});
