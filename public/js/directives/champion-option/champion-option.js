'use strict';
angular.module('ChampionOption', ['ChampionService'])

.directive('championOption', ['championService', function(championService){
    return {
        replace: true,
        restrict: 'E',
        scope: {
            champion: '=',
            masteryLevel: '='
        },
        templateUrl: 'js/directives/champion-option/champion-option.html',
        link: function(scope) {
            scope.getImageUrl = function(champion) {
                return championService.getChampionImageUrl(champion);
            };
        }
    };
}]);