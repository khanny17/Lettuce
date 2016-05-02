'use strict';
angular.module('NavbarController', [])

.controller('navbarController', ['$location', '$scope', 
    function($location, $scope){
    
    $scope.isActive = function isActive(path) {
        return path === $location.path();
    };
}]);