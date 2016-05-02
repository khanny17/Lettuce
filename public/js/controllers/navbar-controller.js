'use strict';
angular.module('NavbarController', [])

//This is a controller for the navbar for the team-specific site

.controller('navbarController', ['$location', '$scope', 
    function($location, $scope){
    
    //Returns true if the given string path matches the page we are on
    //This exists so that the styles for the tabs work properly
    $scope.isActive = function isActive(path) {
        return path === $location.path();
    };
}]);