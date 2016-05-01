'use strict';
angular.module('SearchController', [])

.controller('searchController', ['$scope', '$location', 'teamService',
    function($scope, $location, teamService){
    
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
}]);