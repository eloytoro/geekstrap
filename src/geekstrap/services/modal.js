angular.module('fg.geekstrap')

.provider('Modal', function () {
    var ModalTemplate = function (name, config) {
        this.templateUrl = config.templateUrl;
        this.template = config.template;
        this.defaults = config.defaults;
        this.name = name;
    };

    var storage = {};

    var provider = this;

    this.modal = function (name, invokable) {
        storage[name] = function (injector) {
            var results = injector.invoke(invokable);
            return new ModalTemplate(name, results);
        };
        return provider;
    };

    this.$get = function ($document, $compile, $rootScope, $http, $templateCache, $q, $animate, $injector) {

        // Set all configurations
        Object.keys(storage).forEach(function (key) {
            storage[key] = storage[key]($injector);
        });

        var $scope = $rootScope.$new(),
            $element,
            deferred,
            activeModals = [],

            pushModal = function (modal) {
                $element.append(modal.element);
                modal.element.css('z-index', 10000 + activeModals.length);
                activeModals.forEach(function (modal) {
                    modal.sendBack();
                });
                activeModals.unshift(modal);
                $scope.show = true;
            },

            shiftModal = function () {
                var modal = activeModals.shift();
                modal.element.remove();
                activeModals.forEach(function (modal) {
                    modal.bringForward();
                });
                $scope.show = activeModals.length;
            },

            Modal = function (template) {
                var callbacks = {
                    accept: [], dismiss: [], link: [],
                    bringForward: [], sendBack: [],
                    when: function (prop) {
                        $q.all(callbacks[prop].map(function (cb) {
                            return $q.when(cb());
                        })).then(function () {
                            shiftModal();
                        });
                    },
                    call: function (prop) {
                        callbacks[prop].forEach(function (cb) {
                            cb();
                        });
                    }
                };
                var _this = this;

                this.$template = template;

                this.accept = function () {
                    callbacks.when('accept');
                };

                this.dismiss = function () {
                    callbacks.when('dismiss');
                };

                this.link = function (element) {
                    _this.element = element;
                    pushModal(_this);

                    callbacks.call('link');
                };

                this.bringForward = function () {
                    callbacks.call('bringForward');
                };

                this.sendBack = function () {
                    callbacks.call('sendBack');
                };

                this.on = function (e, cb) {
                    e.split(' ').forEach(function (e) {
                        callbacks[e].push(cb.bind(_this));
                    });
                    return _this;
                };
            };

        $compile(angular.element(
            '<div class="fg-modal-wrapper ng-hide" ng-show="show"></div>'
        ))($scope, function (clone) {
            $element = clone;
            $document.find('body').append($element);
        });

        ModalTemplate.prototype.pop = function (scope) {
            var modal = new Modal(this);

            if (scope.constructor.name === 'Object') {
                var tempScope = $rootScope.$new();
                scope.forEach(function (property, key) {
                    tempScope[key] = property;
                });
                scope = tempScope;
            } else {
                scope = scope.$new();
            }

            scope.$modal = modal;

            var _this = this;

            var link = function (element) {
                $compile(element)(scope, modal.link);
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

            if (this.defaults) {
                Object.keys(this.defaults).forEach(function (key) {
                    modal.on(key, _this.defaults[key]);
                });
            }

            return modal;
        };

        return function (name) {
            if (!name) return activeModals[0];
            return storage[name];
        };
    };
});
