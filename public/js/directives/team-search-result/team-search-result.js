'use strict';
angular.module('TeamSearchResultDirective', [])

.directive('teamSearchResult', [function(){
    return {
        replace: true,
        restrict: 'E',
        scope: {
            team: '=',
            goToTeamPage: '&go'
        },
        templateUrl: 'js/directives/team-search-result/team-search-result.html'
    };
}]);