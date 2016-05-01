'use strict';
angular.module('SearchController', [])

.controller('searchController', ['$scope', '$location', 'teamService', 'TeamName',
    function($scope, $location, teamService, teamName){
    
    $scope.searchQuery = ($location.search()).query;

    $scope.loading = true;
    $scope.teams = [];
    teamService.searchTeams($scope.searchQuery, function(teams){
        $scope.teams.push.apply($scope.teams, teams);
        $scope.loading = false;
    }, function(error){
        $scope.error = error;
        $scope.loading = false;
    });

    $scope.goToTeamPage = function goToTeamPage(name) {
        window.location.replace(teamService.buildTeamUrl(name, teamName));
    };
}]);