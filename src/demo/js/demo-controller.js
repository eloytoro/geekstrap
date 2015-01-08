angular.module('app', ['fg.geekstrap'])

.config(function (ModalProvider) {
    ModalProvider.modal('demoModal', {
        templateUrl: 'src/demo/templates/modal.html',
        title: 'Demo Modal'
    });
})

.controller('BodyController', function ($scope, $interval, Modal, $q) {
    $scope.bulletTooltip = "linkedin";

    $scope.scroll = 0;

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

    $scope.msg = 'WHY HELLO!';

    Modal('demoModal').pop($scope)
        .on('accept', function () {
            var deferred = $q.defer();

            setTimeout(deferred.resolve, 1000);

            return deferred.promise;
        })
        .on('dismiss', function () {
            console.log('dismiss');
        });

    $scope.alerts = [];

    $scope.alert = function(text, type) {
        $scope.alerts.push({
            text: text,
            class: "hover-green"
        });
    };
    $scope.error = function(text, type) {
        $scope.alerts.push({
            text: text,
            class: "hover-red"
        });
    };

    $scope.onload = function() {
        $interval.cancel(this.interval);
        this.interval = undefined;
    };

    $scope.doload = function() {
        if (this.interval) return;
        $scope.progress = 0;
        this.interval = $interval(function(tick) {
            $scope.progress += 10;
        }, 200);
    };

    $scope.doscroll = function(val) {
        $scope.scroll += val;
    };

    $scope.warningModalShow = function(flag) {
        $scope.warningModalVisible = flag;
    };

    $scope.myTags = [];

    $scope.myAutocomplete = 'youtube google facebook twitter instagram yahoo github'
    .split(' ')
    .map(function (item, index) {
        return {
            name: item,
            id: index
        };
    });

    $scope.myIcons = function (item) {
        return 'fa-' + item.name;
    };

    $scope.$watch('myTags', function (val) {
        console.log(val);
    }, true);

});
