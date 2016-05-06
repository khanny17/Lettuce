'use strict';
angular.module('BuilderColumn', [
    'BuilderFilterFactory', 
    'ChampionOption', 
    'SummonerService', 
    'BuilderColumnFilter',
    'SocketFactory',
    'SortByMastery'
])

.directive('builderColumn', ['BuilderFilter', 'socket', 'summonerService',
    function(BuilderFilter, socket, summonerService){
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


            scope.getSummonerName = function(){
                return (_.find(scope.filters, function(filter){
                   return filter.type === BuilderFilter.getTypes().summoner;
               }) || {}).model;
            };




            scope.filters.forEach(initFilter);
            function initFilter(filter) {
                if(filter.type === BuilderFilter.getTypes().summoner){
                    //TODO come back and eliminate the need for getTeamSummonersSynch()
                    //Too hacky and too much coupling 
                    var summoners = summonerService.getTeamSummonersSynch(); 
                    filter.options = _.map(summoners, function(summoner){
                        return summoner.name;
                    });
                } else {
                    filter.options = BuilderFilter.getFilterTypeOptions(filter.type);
                }
            }
        }
    };
}]);
