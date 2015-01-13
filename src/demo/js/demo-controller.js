angular.module('app', ['fg.geekstrap'])

.config(function (ModalProvider) {
    ModalProvider.modal('demoModal', function ($animate) {
        return {
            templateUrl: 'src/demo/templates/modal.html',
            defaults: {
                'dismiss accept': function () {
                    return $animate.addClass(this.element, 'fg-modal-fade');
                },
                link: function () {
                    $animate.removeClass(this.element, 'fg-modal-fade');
                },
                overlay: function () {
                    this.element.css('padding-top', '-=20px');
                    this.scale += 0.1;
                    this.element.css('transform', 'scale(' + this.scale + ')');
                },
                conceal: function () {
                    this.scale = this.scale ? this.scale - 0.1 : 0.9;
                    this.element.css('padding-top', '+=20px');
                    this.element.css('transform', 'scale(' + this.scale + ')');
                }
            }
        };
    });
})

.controller('BodyController', function ($scope, $interval, Modal, $q, $animate) {
    $scope.bulletTooltip = "linkedin";

    $scope.sidebarItems = [{
        icon: 'anchor',
        title: '1'
    }, {
        icon: 'cloud',
        title: '2'
    }, {
        icon: 'compass',
        title: '3',
        onclick: function() {
            $scope.sidebarItems = [{
                icon: 'child',
                title: '4'
            }, {
                icon: 'eraser',
                title: '5'
            }];
        }
    }];

    $scope.popModal = function () {
        Modal('demoModal').pop($scope)
            .on('link destroy', function () {
                var modals = Modal.list();
                if (modals.length == 2) {
                    setTimeout(function () {
                        modals[0].conceal();
                        modals[1].overlay();
                    }, 1000);
                }
            });
    };

    $scope.scroller = {};

    $scope.doscroll = function(val) {
        $scope.scroller.transpose(val);
    };

    $scope.myTags = [];

    $scope.removeTag = function (tag) {
        $scope.myTags.splice($scope.myTags.indexOf(tag), 1);
        $scope.myAutocomplete.push(tag);
    };

    $scope.addTag = function (tag) {
        $scope.myTags.push(tag);
        $scope.myAutocomplete.splice($scope.myAutocomplete.indexOf(tag), 1);
        return true;
    };

    $scope.myAutocomplete = 'youtube google facebook twitter instagram yahoo github bycicle calculator bus cc plug adjust anchor archive area-chart asterisk bank building calendar car camera code cogs dashboard download envelope female eye level-up lightbulb-o magic pencil phone paw plane heart rocket rss search sort spinner spoon times terminal trash tty users umbrella user warning wheelchair wifi inbox info'.split(' ').map(function (item, index) {
        return {
            name: item,
            id: index
        };
    });

});
