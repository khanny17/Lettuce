'use strict';
angular.module('SearchController', ['TeamService'])

//Controller for "search.html"

.controller('searchController', ['$scope', '$location', 'teamService',
    function($scope, $location, teamService){

        //This gets the query param from the url
        //ex: if the url is this: http://localhost:8080/search?query=abcDEFghi
        //    $scope.searchQuery will become "abcDEFghi"
        $scope.searchQuery = ($location.search()).query; 

        //This variable is hooked up to a spinner icon
        $scope.loading = true;
        //An arry of the teams we've found. Its obviously empty to start
        $scope.teams = [];
        teamService.searchTeams($scope.searchQuery, function(teams){
            //This line pushes the teams into the existing array. The alternative
            //would be to just say $scope.teams = teams, but I think that causes
            //an issue because it changes the object.
            $scope.teams.push.apply($scope.teams, teams); 
            $scope.loading = false; //Set this variable to false, hiding the spinner icon
        }, function(error){
            $scope.error = error;
            $scope.loading = false;
        });

        //function to open a new tab to the "team specific" page
        $scope.goToTeamPage = function goToTeamPage(name) {
            teamService.goToTeamPage(name); 
        };
    }]);