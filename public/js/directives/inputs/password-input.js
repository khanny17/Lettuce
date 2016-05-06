'use strict';
angular.module('PasswordInput', [])

.directive('passwordInput', [function(){
    return {
        replace: true,
        restrict: 'E',
        scope: {
            label: '@',
            model: '=',
            error: '=',
            success: '='
        },
        templateUrl: 'js/directives/inputs/password-input.html'
    };
}]);