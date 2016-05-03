'use strict';
angular.module('CreateController', ['TeamService'])

.controller('createController', ['$scope', 'teamService',
    function($scope, teamService){

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

        //Get the team names and check to see if the name is taken yet
        teamService.getTeamNames(function(teamNames){
            if(teamNames.indexOf(newVal) >= 0){
                //Its taken, give them a niceish message about the error
                $scope.validationErrors.name = 'That team already has a page';
            } else {
                //Not taken, we set the error to null
                $scope.validationErrors.name = null;
            }
        });
    });
}]);