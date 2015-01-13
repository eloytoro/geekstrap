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
            activeModals = [];

        var pushModal = function (modal) {
            $element.append(modal.element);
            modal.element.css('z-index', 10000);
            activeModals.forEach(function (modal) {
                modal.conceal();
            });
            activeModals.unshift(modal);
            $scope.show = true;
        };

        var shiftModal = function (modal) {
            var index = activeModals.indexOf(modal);
            activeModals.splice(index, 1);
            modal.element.remove();
            activeModals.forEach(function (item) {
                if (item.$index > modal.$index) item.overlay();
            });
            $scope.show = activeModals.length;
        };

        var Modal = function (template) {
            var _this = this;
            var callbacks = {
                accept: [], dismiss: [], link: [],
                overlay: [], conceal: [], destroy: [],
                when: function (prop) {
                    $q.all(callbacks[prop].map(function (cb) {
                        return $q.when(cb());
                    })).then(_this.destroy);
                },
                call: function (prop) {
                    callbacks[prop].forEach(function (cb) {
                        cb();
                    });
                }
            };

            this.$template = template;

            this.$index = 0;

            this.accept = function () {
                callbacks.when('accept');
            };

            this.dismiss = function () {
                callbacks.when('dismiss');
            };

            this.destroy = function () {
                shiftModal(_this);
                callbacks.call('destroy');
            }

            this.link = function (element) {
                _this.element = element;
                pushModal(_this);

                callbacks.call('link');
            };

            this.overlay = function () {
                if (_this.$index === 0) return;
                _this.element.css('z-index', '+=1');
                _this.$index--;
                callbacks.call('overlay');
            };

            this.conceal = function () {
                _this.element.css('z-index', '-=1');
                _this.$index++;
                callbacks.call('conceal');
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

        var factory = function (name) {
            if (!name) return activeModals[0];
            return storage[name];
        };

        factory.list = function (index) {
            return activeModals.sort(function (a, b) {
                return a.$index > b.$index;
            });
        };

        return factory;
    };
});
