angular.module('fg.geekstrap')

.provider('Modal', function () {
    var Modal = function (name, config) {
        this.templateUrl = config.templateUrl;
        this.title = config.title;
        this.name = name;
    };

    var storage = [];

    this.modal = function (name, config) {
        storage[name] = new Modal(name, config);
    };

    this.wrapperTemplateUrl = 'geekstrap/templates/modal.html';

    this.$get = function ($document, $compile, $rootScope, $http, $templateCache, $q) {
        var $scope = $rootScope.$new(),
            $element,
            deferred,
            currentModal;

        $http({
            method: 'GET',
            cache: $templateCache,
            url: this.wrapperTemplateUrl,
            type: 'text/html'
        }).success(function (data) {
            $element = angular.element(data);
            $element.find('[ng-transclude]')
                .removeAttr('ng-transclude')
                .addClass('fg-modal-transclude');
            $compile($element)($scope, function (clone) {
                $element = clone;
                $document.find('body').append($element);
            });
        });

        $scope.close = function () {
            currentModal.dismiss();
        };

        $scope.save = function () {
            currentModal.accept();
        };

        Modal.prototype.on = function (e, listener) {
            $rootScope.$on('modal:' + this.name + ':' + e, listener);
            return this;
        };

        Modal.prototype.pop = function (scope) {
            if (scope.constructor.name === 'Object') {
                var tempScope = $rootScope.$new();
                scope.forEach(function (property, key) {
                    tempScope[key] = property;
                });
                scope = tempScope;
            }

            var _this = this;
            $http({
                method: 'GET',
                cache: $templateCache,
                url: this.templateUrl,
                type: 'text/html'
            }).success(function (data) {
                $compile(data)(scope, function (clone) {
                    $element.find('.panel-body')
                        .html(clone);
                    $scope.show = true;
                    $scope.title = _this.title;
                    currentModal = _this;
                    $rootScope.$broadcast('modal:' + this.name + ':open');
                });
            });
            return this;
        };

        Modal.prototype.dismiss = function () {
            $rootScope.$broadcast('modal:' + this.name + ':close');
            $scope.show = false;
        };

        Modal.prototype.accept = function () {
            $rootScope.$broadcast('modal:' + this.name + ':save');
        };

        return function (name) {
            if (!name) return currentModal;
            return storage[name];
        };
    };
});
