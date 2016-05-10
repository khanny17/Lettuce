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
            scope.orderOptions = [
                {label: 'Number of Games', value: 'totalSessionsPlayed'},
                {label: 'Wins', value: 'totalSessionsWon'},
                {label: 'Losses', value: 'totalSessionsLost'},
                {label: 'Most Deaths', value: 'maxNumDeaths'},
                {label: 'Total Gold Earned', value: 'totalGoldEarned'},
                {label: 'Double Kills', value: 'totalDoubleKills'},
                {label: 'Triple Kills', value: 'totalTripleKills'},
                {label: 'Quadra Kills', value: 'totalQuadraKills'},
                {label: 'Penta Kills', value: 'totalPentaKills'},
            ];

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