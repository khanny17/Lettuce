'use strict';
angular.module('AuthModals', ['AuthService'])

.service('authModals', ['AuthService', '$location', '$uibModal',

function(authService, $location, $uibModal){

    this.openLogin = function(){
        var modalInstance = $uibModal.open({
            templateUrl: 'js/modals/auth-modals/login-modal.html',
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

    this.openRegister = function(){
        var modalInstance = $uibModal.open({
            templateUrl: 'js/modals/auth-modals/register-modal.html',
            size: 'sm',
            controller: ['$scope', 'AuthService',
            function($modalScope, AuthService){
                $modalScope.user = {
                    name: '',
                    summoner:'',
                    password: ''
                };
                $modalScope.register = function() {
                    AuthService.register($modalScope.user)
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