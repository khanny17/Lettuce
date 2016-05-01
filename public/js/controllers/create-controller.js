'use strict';
angular.module('CreateController', [])

.controller('createController', ['$scope', 'teamService',
    function($scope, teamService){
    $scope.team = {};
    $scope.validationErrors = {};
    $scope.validationSuccess = {};

    $scope.$watch('team.name', function(newVal, oldVal){
        if(newVal === oldVal){
            return;
        }

        teamService.getTeamNames(function(teamNames){
            if(teamNames.indexOf(newVal) >= 0){
                $scope.validationErrors.name = 'That team already has a page';
            } else {
                $scope.validationErrors.name = null;
            }
        });
    });
}]);