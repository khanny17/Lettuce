'use strict';
angular.module('SortByRole', [])

.filter('sortByRole', [function(){

    //champions: master list of champions
    //roles: list of role strings
    return function(champions, roles) {
        if(!roles || roles.length <= 0) {
            return champions;
        }
        
        var results = [];

        //Remove champs that dont have matching roles
        results = _.filter(champions, function(champ){
            return _.intersection(champ.roles, roles).length > 0;
        });

        return results;
    };
}]);
