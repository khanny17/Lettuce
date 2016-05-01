'use strict';
angular.module('TextInput', [])

.directive('textInput', [function(){
    return {
        replace: true,
        restrict: 'E',
        scope: {
            label: '@',
            model: '=',
            error: '=',
            success: '='
        },
        templateUrl: 'js/directives/inputs/text-input.html'
    };
}]);