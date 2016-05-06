'use strict';
angular.module('TeamController', ['NotificationService', 'AuthService'])

.controller('teamController', ['$scope', 'team', 'notificationService', 'AuthService',
    function($scope, team, notificationService, authService){
    $scope.team = team;

    //Put the authentication on the scope
    $scope.authenticated = authService.isAuthenticated();
    //listen for updates to authentication status
    notificationService.on('authenticated', function(){
        $scope.authenticated = true;
    });
    notificationService.on('unauthenticated', function(){
        $scope.authenticated = false;
    });
}]);