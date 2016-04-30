'use strict';

angular.module('BaseController', [])

.controller('baseController', ['$scope', '$state', 'teamService',
    function($scope, $state, teamService){

    $scope.search = function search() {
        if(!$scope.query){
            return;
        }

        $state.go('base.search', { query: $scope.query });
        $scope.query = '';
        $scope.$apply();
    };


    $scope.teamNames = [];

    teamService.getTeamNames(function addNames(names){
        $scope.teamNames.push.apply($scope.teamNames, names);
    });

}]);