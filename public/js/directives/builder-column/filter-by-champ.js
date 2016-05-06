'use strict';
angular.module('FilterByChamp', [])

.filter('filterByChamp', [function(){

    //champions: master list of champions
    //banned: list of champion names to remove
    return function(champions, bannedNames) {
        if(!bannedNames || bannedNames.length <= 0) {
            return champions;
        }

        var results = [];

        //Remove champs in our banned Ids list
        results = _.filter(champions, function(champ){
            return !_.includes(bannedNames, champ.name);
        });

        return results;
    };
}]);
