angular.module("fg.geekstrap").run(["$templateCache", function($templateCache) {$templateCache.put("geekstrap/templates/modal.html","<div class=\"fg-modal-wrapper ng-hide\" ng-show=\"show\">\n    <div class=\"panel panel-default\">\n        <div class=\"panel-heading\">\n            <button type=\"button\" class=\"close fa fa-times-circle\" ng-click=\"close()\">\n            </button>\n            <h4 class=\"panel-title\" ng-bind=\"title\"></h4>\n        </div>\n        <div class=\"panel-body\" ng-transclude></div>\n        <div class=\"panel-footer\">\n            <button type=\"button\" class=\"btn btn-default\"\n                ng-click=\"close()\">Cerrar</button>\n            <button type=\"button\" class=\"btn btn-primary\"\n                ng-click=\"save()\">\n                Ok\n            </button>\n        </div>\n    </div>\n</div>\n");
$templateCache.put("geekstrap/directives/alert/alert.html","<div class=\"alert alert-dismissible {{alert.class}}\" role=\"alert\" ng-repeat=\"alert in cluster\" ng-click=\"controller.destroy($index)\">\n    <button type=\"button\" class=\"close\"><span aria-hidden=\"true\">&times;</span>\n        <span class=\"sr-only\">Close</span></button>\n    <span>{{alert.text}}</span>\n</div>\n");
$templateCache.put("geekstrap/directives/circular-scroller/circular-scroller.html","<div class=\"fg-cscroller-wrapper\">\n    <div class=\"fg-cscroller-box\" ng-style=\"boxStyle\">\n    </div>\n</div>\n");
$templateCache.put("geekstrap/directives/navbar/navbar-tab.html","<div class=\"fg-navbar-tab\" ng-transclude ng-class=\"{active: active}\">\n</div>\n");
$templateCache.put("geekstrap/directives/navbar/navbar.html","<div class=\"fg-navbar\">\n    <div ng-transclude></div>\n    <div class=\"fg-navbar-caret\" ng-style=\"caretOffset\"></div>\n</div>\n");
$templateCache.put("geekstrap/directives/progress-button/progress-button.html","<button class=\"progress-button\" ng-class=\"{loading: isLoading}\">\n    <div class=\"content\" ng-transclude></div>\n    <div class=\"progress-button-bar\" ng-style=\"loadingBar\"></div>\n</button>\n");
$templateCache.put("geekstrap/directives/sidebar/sidebar-item.html","<div class=\"sidebar-item\" ng-class=\"{active: active}\">\n    <div class=\"sidebar-item-label\" ng-transclude>\n    </div>\n    <div class=\"sidebar-item-icon\">\n        <span class=\"{{icon}}\"></span>\n    </div>\n</div>\n");
$templateCache.put("geekstrap/directives/sidebar/sidebar.html","<div class=\"sidebar\">\n    <div class=\"sidebar-toggle\">\n        <span class=\"{{icon}}\"></span>\n    </div>\n    <div class=\"sidebar-content\" ng-transclude ng-style=\"offset\"></div>\n</div>\n");}]);