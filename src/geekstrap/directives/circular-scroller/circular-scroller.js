angular.module('fg.geekstrap')

/**
 * @ngdoc directive
 * @name fg.geekstrap.directive:circular-scroller
 * @restrict E
 * @param {number=} scroll value within the scope that determines the horizontal scrolling of the directive
 *
 * @description
 * Repeats the transcluded elements across the directive's width, simulating an infinite circular scroller
 * Rules:
 *  - Elements inside the scroller MUST have a fixed width
 *  - Directives inside the scroller can't use the ng-transclude directive, this is a known bug caused by angular's compile method not removing the property from already compiled directives
 *
 * @example
<example module="app">
    <file name="index.html">
        <div ng-controller="BodyController" class="demo-cscroller">
            <circular-scroller scroll="scroll" fg-alias="cscroller">
                <img src="../demo/img/logo_footer.png" style="width: 190px"></img>
            </circular-scroller>
            <button ng-click="doscroll(-130)" class="btn color-purple btn-icon btn-bullet raise hover">
               <i class="fa fa-arrow-left"></i>
                left
            </button>
            <button ng-click="doscroll(130)" class="btn color-lightblue raise hover btn-icon">
                <i class="fa fa-arrow-right"></i>
                right
            </button>
        </div>
    </file>
</example>
 */
.directive('circularScroller', function ($compile, $animate) {

    var CSTemplate = function (element) {
        this.element = element;
        this.interpolate = $compile(element);
    };

    return {
        restrict:'E',
        replace: true,
        transclude: true,
        template: '<div class="fg-cscroller-wrapper"></div>',
        scope: {
            alias: '=?'
        },
        controller: function ($scope, $element, $window, $timeout, $compile) {
            var _this = this;
            var outerWidth = $element.width();

            this.shown = [];
            this.children = [];
            this.exports = {};

            var insert = function (clone) {
                clone.css('left', clone.offset + 'px');
            };

            this.append = function () {
                var lastClone = _this.shown[_this.shown.length - 1];
                var index = lastClone ?
                    (lastClone.index + 1) % _this.children.length :
                    0;
                var offset;
                _this.children[index].interpolate($scope.$parent, function (clone) {
                    _this.shown.push(clone);
                    $element.append(clone);
                    clone.template = _this.children[index];
                    offset = lastClone ?
                        lastClone.offset + lastClone.template.width :
                        0;
                    clone.offset = offset;
                    clone.index = index;
                    insert(clone);
                });
                return offset;
            };

            this.prepend = function () {
                var firstClone = _this.shown[0];
                var index = firstClone ?
                    ((firstClone.index - 1 % _this.children.length) + _this.children.length) % _this.children.length :
                    0;
                var offset;
                _this.children[index].interpolate($scope.$parent, function (clone) {
                    _this.shown.unshift(clone);
                    $element.prepend(clone);
                    clone.template = _this.children[index];
                    offset = firstClone ?
                        firstClone.offset - clone.template.width :
                        0;
                    clone.index = index;
                    clone.offset = offset;
                    insert(clone);
                });
                return offset;
            };

            this.build = function (scroll) {
                scroll = scroll || 0;
                while (_this.append() < outerWidth - scroll);
                while (_this.prepend() > 0 - scroll);
            };

            this.exports.transpose = function (scroll) {
                _this.build(scroll);
                _this.shown.forEach(function (clone, index) {
                    // TODO HELP ME
                    clone.stop().animate({
                        left: (clone.offset += scroll) + 'px'
                    }, 400, function () {
                        _this.shown = _this.shown.filter(function (clone) {
                            if (clone.offset + clone.template.width < 0 ||
                                clone.offset > outerWidth) {
                                clone.remove();
                            return false;
                            }
                            return true;
                        });
                    });
                    // clone.css('left', (clone.offset += scroll) + 'px');
                });
            };

            this.exports.transposeLeft = function (count) {
                if (count > 0) {
                    var current = offset;
                    for (var i = 0; i < count; i++) {
                        _this.prepend();
                    }
                    $scope.scroll += offset - current;
                } else {
                    var acc = 0;
                    count = Math.abs(count);
                    for (var j = 0; j < count; j++) {
                        acc += _this.shown[j][0].offsetWidth;
                    }
                    $scope.scroll -= acc;
                }
            };

            this.exports.transposeRight = function (count) {
                if (count > 0) {
                    var acc = 0;
                    for (var i = 1; i <= count; i++) {
                        acc += _this.shown[_this.shown.length - i][0].offsetWidth;
                    }
                    $scope.scroll -= acc;
                } else {
                    var current = innerWidth;
                    count = Math.abs(count);
                    for (var j = 0; j < count; j++) {
                        _this.append();
                    }
                    $scope.scroll += innerWidth - current;
                }
            };

            angular.element($window).bind('resize', function() {
                outerWidth = $element.width();
                _this.build();
                $scope.$apply();
            });
        },
        link: function (scope, element, attrs, controller, transclude) {
            transclude(scope.$parent, function(clone, scope) {
                clone.each(function () {
                    if (this.nodeType == 3) return;
                    var child = $('<div/>', {
                        'class': 'fg-cscroller-element'
                    });
                    child.append(this);
                    element.append(child);
                    controller.children.push(new CSTemplate(child));
                });
            });

            $(function() {
                controller.children.forEach(function (child) {
                    child.width = child.element.outerWidth();
                    child.element.remove();
                });
                controller.build();
            });

            if (scope.alias) scope.alias = controller.exports;
        }
    };
});
