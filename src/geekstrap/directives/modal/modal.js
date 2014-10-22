angular.module('fg.geekstrap')

/**
 * @ngdoc directive
 * @name fg.geekstrap.directive:modal
 * @restrict E
 * @param {boolean=} visible whether the modal is visible or not
 *
 * @description
 * Just your average day modal
 *
 * @example
<example module="app">
  <file name="index.html">
    <div ng-controller="BodyController">
      <modal visible="warningModalVisible">
        <p><h2>Warning!</h2></p>
        <p>An error occurred</p>
        <button class="hover-yellow fa fa-close" ng-click="warningModalShow(false)">Close</button>
      </modal>
      <button class="hover-red" ng-click="warningModalShow(true)">Show Modal</button>
    </div>
  </file>
</example>
 */
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
