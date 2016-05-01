'use strict';
angular.module('TeamController', [])

.controller('teamController', ['$scope', 'team', function($scope, team){
    $scope.team = team;
}]);