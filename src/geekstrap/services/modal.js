angular.module('fg.geekstrap')

.provider('Modal', function () {
    var ModalTemplate = function (name, config) {
        this.templateUrl = config.templateUrl;
        this.template = config.template;
        this.title = config.title;
        this.name = name;
    };

    var storage = [];

    this.modal = function (name, config) {
        storage[name] = new ModalTemplate(name, config);
        return this;
    };

    this.wrapperTemplateUrl = 'geekstrap/templates/modal.html';

    this.$get = function ($document, $compile, $rootScope, $http, $templateCache, $q) {
        var $scope = $rootScope.$new(),
            $element,
            deferred,
            currentModal,
            Modal = function (template) {
                var callbacks = {
                    accept: [],
                    dismiss: [],
                    link: []
                };

                var wrap = function (prop, cb) {
                    $q.all(callbacks[prop].map(function (cb) {
                        return $q.when(cb());
                    })).then(function () {
                        $scope.show = false;
                    });
                };

                this.$template = template;

                this.accept = function () {
                    wrap('accept');
                };

                this.dismiss = function () {
                    wrap('dismiss');
                };

                this.link = function () {
                    wrap('link');
                };

                this.on = function (e, cb) {
                    callbacks[e].push(cb);
                    return this;
                };
            };

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

        ModalTemplate.prototype.pop = function (scope) {
            var modal = new Modal(this);

            if (scope.constructor.name === 'Object') {
                var tempScope = $rootScope.$new();
                scope.forEach(function (property, key) {
                    tempScope[key] = property;
                });
                scope = tempScope;
            }

            var _this = this;

            var link = function (element) {
                $compile(element)(scope, function (clone) {
                    $element.find('.panel-body').html(clone);
                    $scope.show = true;
                    $scope.title = _this.title;
                    currentModal = modal;
                    modal.link();
                });
            };

            if (this.templateUrl) {
                $http({
                    method: 'GET',
                    cache: $templateCache,
                    url: this.templateUrl,
                    type: 'text/html'
                }).success(link);
            } else {
                link(this.template);
            }

            return modal;
        };

        return function (name) {
            if (!name) return currentModal;
            return storage[name];
        };
    };
});
