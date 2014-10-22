angular.module('fg.geekstrap')

.directive('sidebar', function() {
    return {
        restrict:'E',
        replace: true,
        transclude: true,
        templateUrl: 'geekstrap/directives/sidebar/sidebar.html',
        scope: {
            icon: '@',
            default: '=',
            persist: '='
        },
        controller: ['$scope', function($scope) {
            this.items = [];
            $scope.offset = {};
            this.setActive = function(index) {
                if (!$scope.persist) return;
                for (var key in this.items) {
                    this.items[key].active = key == index;
                    this.items[key].$digest();
                }
            };

            this.addItem = function(item) {
                var index = this.items.length;
                this.items.push(item);
                item.active = index == $scope.default;
                return index;
            };
        }],
        link: function (scope, element, attrs, controller) {
            element.children().eq(0).on('mouseenter', function() {
                if (scope.show) return;
                scope.peek = true;
                scope.offset.left = '-250px';
                scope.$digest();
            });
            element.children().eq(1).on('mouseenter', function() {
                scope.show = true;
                scope.offset.left = '0px';
                scope.$digest();
            });
            element.on('mouseleave', function() {
                scope.peek = false;
                scope.show = false;
                scope.offset.left = '-305px';
                scope.$digest();
            });
        }
    };
})

.directive('sidebarItem', function() {
    return {
        restrict:'E',
        replace: true,
        transclude: true,
        scope: {
            icon: '@'
        },
        templateUrl: 'geekstrap/directives/sidebar/sidebar-item.html',
        require: '^sidebar',
        link: function (scope, element, attrs, controller) {
            scope.index = controller.addItem(scope);
            element.on('click', function() {
                if (scope.active) {
                    scope.active = false;
                } else {
                    controller.setActive(scope.index);
                }
            });
        }
    };
});
