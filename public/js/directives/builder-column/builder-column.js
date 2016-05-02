'use strict';
angular.module('BuilderColumn', ['BuilderFilterFactory'])

.directive('builderColumn', ['BuilderFilter', function(BuilderFilter){
    return {
        replace: true,
        restrict: 'E',
        scope: {},
        templateUrl: 'js/directives/builder-column/builder-column.html',
        link: function(scope, elem, attrs) {
            
            //The different kinds of filters we can add
            scope.filterOptions = BuilderFilter.getOptions();

            //Start our list with the summoner filter added
            scope.filters = [new BuilderFilter(BuilderFilter.getTypes().summoner)]; 

            //Add a filter to our list
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
}]);