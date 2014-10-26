angular.module('fg.geekstrap')

.directive('navbar', function() {
    return {
        restrict:'E',
        replace: true,
        transclude: true,
        templateUrl: 'geekstrap/directives/navbar/navbar.html',
        scope: {
            default: "@",
            alias: "=?"
        },
        controller: ['$scope', '$window', function ($scope, $window) {
            this.tabs = [];
            var _this = this;

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
                    this.tabs[key].$apply();
                }
                $scope.activeTab = id;
                this.moveCaret(id);
                $scope.$apply();
            };

            this.addTab = function(tab) {
                var index = this.tabs.length;
                this.tabs[index] = tab;
                return index;
            };

            angular.element($window).bind('resize', function() {
                for (var key in _this.tabs) {
                    _this.tabs[key].refresh();
                }
                _this.moveCaret($scope.activeTab);
                $scope.$apply();
            });
            
            this.exports = { setActive: this.setActive };

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

            if (scope.alias) scope.alias = controller.exports;
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
            activable: '=?'
        },
        link: function (scope, element, attrs, controller) {
            scope.width = element[0].offsetWidth;
            scope.id = controller.addTab(scope);
            if (scope.activable) {
                element.on('click', function() {
                    controller.setActive(scope.id);
                });
            }
            scope.refresh = function() {
                scope.width = element[0].offsetWidth;
            };
        }
    };
});
