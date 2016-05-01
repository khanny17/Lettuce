'use strict';
angular.module('CreateController', [])

.controller('createController', ['$scope', function($scope){
    $scope.team = {};
    $scope.validationErrors = {};
    $scope.validationSuccess = {};
}]);