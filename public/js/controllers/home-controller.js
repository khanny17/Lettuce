'use strict';
angular.module('HomeController', ['TeamService', 'SummonerService'])

//This is the controller for "base.html", and all of its children templates
//In other words, the functions here are shared across all pages on the external version
//  of the site

.controller('homeController', ['$scope', '$q', 'summonerService',
    function($scope, $q, summonerService){

    summonerService.getTeamSummoners()
    .then(function(summoners){
        $scope.summoners = summoners;
        var promises = [];
        summoners.forEach(function(summoner){
            promises.push(summonerService.getSummonerChampStats(summoner.id));
        });
        return $q.all(promises);
    })
    .then(function(stats){
        stats.forEach(function(stat){
            var summoner = _.find($scope.summoners, function(summoner){
                return summoner.id === stat.summonerId;
            });
            summoner.stats = stat;
        });

        //remove the player stats - its mixed in with the champion stats,
        //has a champ id of 0
        $scope.summoners.forEach(function(summoner){
            $scope.playerStats = _.remove(summoner.stats.listOfChamps, function(champ){
                return champ.id === 0;
            });
        });
    });
}]);