'use strict';
angular.module('NavbarController', ['AuthService'])


//This is a controller for the navbar for the team-specific site

.controller('navbarController', ['$location', '$scope', '$uibModal', 
    function($location, $scope, $uibModal){
    
    //Returns true if the given string path matches the page we are on
    //This exists so that the styles for the tabs work properly
    $scope.isActive = function isActive(path) {
        return path === $location.path();
    };

    $scope.openLoginModal = function() {
    	var modalInstance = $uibModal.open({
    		templateUrl: 'views/templates/login-modal.html',
    		size: 'sm',
    		controller: ['$scope', 'AuthService',
    		function($modalScope, AuthService){
                $modalScope.user = {
                    name: '',
                    password: ''
                };
    			$modalScope.login = function() {
                    AuthService.login($modalScope.user)
                    .then(function(msg) {
                        modalInstance.close(msg);
                    }, function(errMsg) {
                        console.error(errMsg);
                    });
    			};
    			$modalScope.cancel = function() {
    				modalInstance.close();
    			};
    		}]
    	});
    };
}]);





  