angular.module('fg.geekstrap')

.directive('navbar', function() {
    return {
        restrict:'E',
        replace: true,
        transclude: true,
        templateUrl: 'geekstrap/directives/navbar/navbar.html',
        scope: {
            default: "@"
        },
        controller: ['$scope', '$window', function ($scope, $window) {
            this.tabs = [];
            var vm = this;

            $scope.caretOffset = {};
            $scope.activeTab = 0;

            this.moveCaret = function(id) {
                var offset = 0;
                for (var i = 0; i < id; i++) {
                    offset += this.tabs[i].width;
                }
                $scope.caretOffset.left = offset + 'px';
                $scope.caretOffset.width = this.tabs[id].width + 'px';
            };

            this.setActive = function(id) {
                for (var key in this.tabs) {
                    this.tabs[key].active = id == key;
                    this.tabs[key].$digest();
                }
                $scope.activeTab = id;
                this.moveCaret(id);
                $scope.$digest();
            };

            this.addTab = function(tab) {
                var index = this.tabs.length;
                this.tabs[index] = tab;
                return index;
            };

            angular.element($window).bind('resize', function() {
                for (var key in vm.tabs) {
                    vm.tabs[key].refresh();
                }
                vm.moveCaret($scope.activeTab);
                $scope.$digest();
            });

        }],
        link: function (scope, element, attrs, controller) {
            for (var i = 0; i < controller.tabs.length; i++) {
                if (controller.tabs[i].link == scope.default) {
                    controller.tabs[i].active = true;
                    scope.activeTab = i;
                    controller.moveCaret(i);
                    break;
                }
            }
        }
    };
})

.directive('navbarTab', function() {
    return {
        restrict:'E',
        require: '^navbar',
        replace: true,
        transclude: true,
        templateUrl: 'geekstrap/directives/navbar/navbar-tab.html',
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
