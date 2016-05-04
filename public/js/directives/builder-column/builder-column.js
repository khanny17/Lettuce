'use strict';
angular.module('BuilderColumn',
    ['BuilderFilterFactory', 'ChampionOption', 'SummonerService', 'BuilderColumnFilter'])

.directive('builderColumn', ['BuilderFilter', function(BuilderFilter){
    return {
        replace: true,
        restrict: 'E',
        scope: {
            champions: '=',
            filters: '=',
            championName: '='
        },
        templateUrl: 'js/directives/builder-column/builder-column.html',
        link: function(scope) {
            //The different kinds of filters we can add
            scope.filterOptions = BuilderFilter.getOptions();

            scope.getPlaceholder = BuilderFilter.getPlaceholder;

            //Add a filter to our list
            //TODO connect this to the server
            scope.addFilter = function addFilter(filterOption) {
                //Check to make sure we dont already have the maximum # added
                if(maxNumberOfFilterTypeReached(filterOption)){
                    return;
                }

                scope.filters.push(new BuilderFilter(filterOption.type));
            };

            //Determines if the addFilter button should be disabled
            scope.isDisabled = function isDisabled(selectedFilter) {
                if(!selectedFilter) {
                    return true;
                }

                return maxNumberOfFilterTypeReached(selectedFilter);
            };

            //Determines if we have the max number of that filter type in our list already
            function maxNumberOfFilterTypeReached(filterOption) {
                var existingNumberOfType = _.filter(scope.filters, function(filter){
                    return filter.type === filterOption.type;
                }).length;

                //No max means no max!
                return (filterOption.max && existingNumberOfType >= filterOption.max);
            }
        }
    };
}])

.filter('champFilter', ['summonerService', 'BuilderFilter',
    function(summonerService, BuilderFilter){

    //champions: master list of champions
    //filters: list of BuilderFilter objects
    return function(champions, filters) {
        var results = champions;

        //Filter by Role

        //Get all the role filters
        var roleFilters = _.filter(filters, {type: BuilderFilter.getTypes().role});
        //Get an array of just the role names
        var roles = _.map(roleFilters, 'model'); 
        //Remove champs that dont have matching roles
        results = _.filter(results, function(champ){
            return _.intersection(champ.Roles, roles); //TODO fix this
        });

        //Sort by champion mastery if we have the summoner
        var summonerFilter = _.find(filters, function(filter){
            return filter.type === BuilderFilter.getTypes().summoner;
        });

        if(summonerFilter && summonerFilter.model){
            results = _.sortBy(results, function(champ){
                return summonerService.getMastery(summonerFilter.model, champ);
            });    
        }

        return results;
    };
}]);