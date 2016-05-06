'use strict';
angular.module('Navbar', ['AuthModals', 'AuthService', 'NotificationService'])

.directive('navbar', [
    '$location',
    'authModals', 
    'AuthService', 
    'notificationService', 
    function($location, authModals, authService, notificationService){
    return {
        replace: true,
        restrict: 'E',
        scope: {
            team: '@'
        },
        templateUrl: 'js/directives/navbar/navbar.html',
        link: function(scope) {
            //Returns true if the given string path matches the page we are on
            //This exists so that the styles for the tabs work properly
            scope.isActive = function isActive(path) {
                return path === $location.path();
            };

            scope.login = function() {
                authModals.openLogin();
            };

            scope.register = function() {
                authModals.openRegister();
            };

            scope.logout = function () {
                authService.logout();
            };

            //Put the authentication on the scope
            scope.authenticated = authService.isAuthenticated();
            //listen for updates to authentication status
            notificationService.on('authenticated', function(){
                scope.authenticated = true;
            });
            notificationService.on('unauthenticated', function(){
                scope.authenticated = false;
            });
        }
    };
}]);