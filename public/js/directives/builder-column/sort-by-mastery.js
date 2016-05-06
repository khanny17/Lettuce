'use strict';
angular.module('SortByMastery', ['SummonerService'])

.filter('sortByMastery', ['summonerService', function(summonerService){

    //champions: master list of champions
    return function(champions, summonerName) {
        var results = [];

        var masteries = summonerService
        .getSummonerMasteriesSynch(summonerName);

        if(masteries){
            results = _.sortBy(champions, function(champion){
                return masteries[champion.id] ? 
                masteries[champion.id].championPoints*-1 :
                0;
            });      
        } else {
            results = champions;
        }

        return results;
    };
}]);
