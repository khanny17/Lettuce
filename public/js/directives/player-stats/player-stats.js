'use strict';
angular.module('PlayerStats', ['ChampionService'])

.directive('playerStats', ['championService',

function(championService){
    return {
        replace: true,
        restrict: 'E',
        scope: {
            summoner: '=',
        },
        templateUrl: 'js/directives/player-stats/player-stats.html',
        link: function(scope) {
            scope.orderProperty = 'maxNumDeaths';

            scope.showDetail = function(champ){
                if(scope.selectedChamp && scope.selectedChamp.id === champ.id){
                    scope.selectedChamp = null;
                } else {
                    scope.selectedChamp = champ;
                }
            };

            championService.getChampions(function(){
                scope.getChampName = championService.getChampionName;
                scope.getChampImage = championService.getImageByChampID;
            });
        }
    };
}]);