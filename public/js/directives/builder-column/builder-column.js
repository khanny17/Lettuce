'use strict';
angular.module('BuilderColumn', [
    'BuilderFilterFactory', 
    'ChampionOption', 
    'SummonerService',
    'ChampionService',
    'BuilderColumnFilter',
    'SocketFactory',
    'SortByMastery',
    'FilterByRole',
    'FilterByChamp'
])

.directive('builderColumn', [
    'BuilderFilter', 
    'socket', 
    'summonerService', 
    'championService',
    function(BuilderFilter, socket, summonerService, championService){
    return {
        replace: true,
        restrict: 'E',
        scope: {
            champions: '=',
            filters: '=',
            championName: '=',
            laneID: '@laneId',
            readOnly: '='
        },
        templateUrl: 'js/directives/builder-column/builder-column.html',
        link: function(scope) {
            //The different kinds of filters we can add
            scope.filterOptions = BuilderFilter.getOptions();
            scope.championName = scope.championName || '';

            scope.getPlaceholder = BuilderFilter.getPlaceholder;

            //Update Champion Name Filter
            var valueWeJustGot = null;
            socket.on('lane:champFilterUpdate:' + scope.laneID, function(laneData){
                scope.championName = laneData.championNameFilter;
                valueWeJustGot = laneData.championNameFilter;
            });

            scope.$watch('championName', function(newVal, oldVal){
                if(newVal !== valueWeJustGot && newVal !== oldVal){
                    socket.emit('lane:champFilterUpdate', {
                        _id: scope.laneID,
                        championNameFilter: scope.championName
                    });
                } else {
                    valueWeJustGot = null;
                }
            });
            //End update Champion Name Filter





            //Add Filter
            scope.addFilter = function addFilter(filterOption) {
                //Check to make sure we dont already have the maximum # added
                if(maxNumberOfFilterTypeReached(filterOption)){
                    return;
                }

                socket.emit('filter:add', { 
                    laneID: scope.laneID, 
                    type: filterOption.type 
                });
            };

            socket.on('filter:add:'+ scope.laneID, function(filter){
                initFilter(filter);
                scope.filters.push(filter);
            });
            //End Add Filter

            //Delete Filter
            scope.deleteFilter = function deleteFilter(id) {
                socket.emit('filter:delete', {
                    _id: id,
                    laneID: scope.laneID
                });
            };

            socket.on('filter:delete:'+ scope.laneID, function(id){
                _.remove(scope.filters, function(filter){
                    return filter._id === id;
                });
            });
            //End Delete Filter




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


            //Filter helpers for ng-repeat
            scope.getSummonerName = function(){
                return (_.find(scope.filters, function(filter){
                   return filter.type === BuilderFilter.getTypes().summoner;
               }) || {}).model;
            };

            scope.getRoles = function() {
                var roleType = BuilderFilter.getTypes().role;
                var roleFilters = _.filter(scope.filters, {
                    type: roleType
                });
                //Return an array of just the role names
                var roles = _.map(roleFilters, 'model'); 
                //Get the valid options for role names
                var validRoles = BuilderFilter.getFilterTypeOptions(roleType);
                //Return only the roles that are valid options
                return _.intersection(roles, validRoles);
            };

            scope.getBannedChamps = function() {
                var banType = BuilderFilter.getTypes().ban;
                var banFilters = _.filter(scope.filters, {
                    type: banType
                });
                //array of champ names to ban
                return _.map(banFilters, 'model'); 
            };
            //End filter helpers

            scope.filters.forEach(initFilter);
            function initFilter(filter) {
                var types = BuilderFilter.getTypes();
                if(filter.type === types.summoner){
                    //TODO come back and eliminate the need for getTeamSummonersSynch()
                    //Too hacky and too much coupling 
                    var summoners = summonerService.getTeamSummonersSynch(); 
                    filter.options = _.map(summoners, function(summoner){
                        return summoner.name;
                    });
                } else if(filter.type === types.ban){ 
                    championService.getChampions(function(champions){
                        filter.options = _.map(champions, function(champ){
                            return champ.name;
                        });
                    });
                }else {
                    filter.options = BuilderFilter.getFilterTypeOptions(filter.type);
                }
            }

            scope.getMasteryLevel = function getMasteryLevel(champ) {
                var summoner = scope.getSummonerName();
                var mastery = summonerService.getMasterySynch(summoner, champ.id);
                if(!mastery){
                    return null;
                }
                return mastery.championLevel;
            };
        }
    };
}]);
