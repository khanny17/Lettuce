'use strict';
angular.module('BaseController', ['TeamService'])

//This is the controller for "base.html", and all of its children templates
//In other words, the functions here are shared across all pages on the external version
//  of the site

.controller('baseController', ['$scope', '$state', 'teamService',
    function($scope, $state, teamService){

    //This is function that does the searching when you press enter in the
    //search bar
    $scope.search = function search() {
        //If they didnt type anything, dont bother searching
        if(!$scope.query){
            return;
        }
        
        //Go to the search page with whatever the user searched as the query
        $state.go('base.search', { query: $scope.query });
        $scope.query = ''; //clear the query
        $scope.$apply(); //forces the DOM to update
    };

    //This holds all the team names that we have in the db
    //These become the options in the search bar typeahead
    $scope.teamNames = [];
    //Get the team names from our angular service file: "team-service.js"
    teamService.getTeamNames(function addNames(names){
        //This is basically saying $scope.teamNames = names, but in a confusing way
        //because I worry that changing the object reference wont make the DOM update
        //properly, although I haven't actually confirmed that this would be an issue
        $scope.teamNames.push.apply($scope.teamNames, names);
    });

}]);