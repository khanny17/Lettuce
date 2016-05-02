'use strict';
angular.module('ChampionOption', [])

.directive('championOption', [function(){
    return {
        replace: true,
        restrict: 'E',
        scope: {
            champion: '=',
            masteryLevel: '='
        },
        templateUrl: 'js/directives/champion-option/champion-option.html'
    };
}]);