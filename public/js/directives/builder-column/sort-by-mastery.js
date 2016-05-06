'use strict';
angular.module('SortByMastery', ['SummonerService'])

.filter('sortByMastery', ['summonerService', function(summonerService){

    //champions: master list of champions
    //filters: list of BuilderFilter objects
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

        //Filter by Role

        // //Get all the role filters
        // var roleFilters = _.filter(filters, {type: BuilderFilter.getTypes().role});
        // //Get an array of just the role names
        // var roles = _.map(roleFilters, 'model'); 
        // //Remove champs that dont have matching roles
        // results = _.filter(results, function(champ){
        //     return _.intersection(champ.Roles, roles); //TODO fix this
        // });