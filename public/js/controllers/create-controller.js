'use strict';
angular.module('CreateController', ['TeamService'])

.controller('createController', ['$scope', '$state', 'teamService', 'TeamName',
    function($scope, $state, teamService, TeamName){

    //This is an empty JSON object to start, but as you add inputs with
    //  "ng-model=team.exampleProperty" it will populate those values in this object
    $scope.team = {};

    //This can be used in the event that there is an error in a form field
    //You can see an example of using it below
    $scope.validationErrors = {};
    $scope.validationSuccess = {};

    //$scope.$watch will "watch" a scope variable for changes.
    //When the variable changes, it calls the function we defined here
    $scope.$watch('team.name', function(newVal, oldVal){
        //If it didnt change, dont do anything. Idk when this "if" would be called,
        //  but i think it does happen sometimes
        if(newVal === oldVal){ 
            return;
        }

        if(newVal && !/^[a-zA-Z0-9-\s]+$/.test(newVal)) {
            $scope.validationErrors.name = 'Only letters and numbers are allowed';
            return;
        }

        //Get the team names and check to see if the name is taken yet
        teamService.getTeamNames(function(teamNames){
            var exists = _.find(teamNames, function(name){
                return name.toLowerCase() === newVal.toLowerCase();
            });
            if(exists){
                //Its taken, give them a niceish message about the error
                $scope.validationErrors.name = 'That team already has a page';
            } else {
                //Not taken, we set the error to null
                $scope.validationErrors.name = null;
            }
        });
    });

    $scope.$watch('team.tag', function(newVal){
        if(!newVal){
            $scope.validationErrors.tag = 'Tag is required';
        } else if(newVal.length > 5){
            $scope.validationErrors.tag = 'Max of 5 characters allowed';
        } else {
            $scope.validationErrors.tag = null;
        }
    });

    $scope.createTeam = function() {
        teamService.createTeam($scope.team, function(data){
            $scope.success = true;
            $scope.teamPageUrl = teamService.buildTeamUrl(data.name, TeamName.val);
        });
    };

    $scope.hasErrors = function() {
        return !$scope.team.name || $scope.validationErrors.name;
    };
}]);