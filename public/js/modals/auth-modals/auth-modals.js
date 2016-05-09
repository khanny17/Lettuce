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
                        $modalScope.validationErrors = {};
                    }, function(error) {
                        $modalScope.validationErrors = {};
                        $modalScope.validationErrors[error.field] = error.msg;
                        console.error(error.msg);
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
                $modalScope.errors = {};
                $modalScope.user = {
                    name: '',
                    summoner:'',
                    password: ''
                };

                $modalScope.backupPassword = '';

                $modalScope.register = function() {
                    if($modalScope.backupPassword !== $modalScope.user.password) {
                        return;
                    }

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

                $modalScope.$watch('user.password', function(newVal){
                    if(newVal !== $modalScope.backupPassword) {
                        $modalScope.errors.password = 'Passwords do not match';
                    } else {
                        $modalScope.errors.password = null;
                    }
                });
                $modalScope.$watch('backupPassword', function(newVal){
                    if(newVal !== $modalScope.user.password) {
                        $modalScope.errors.password = 'Passwords do not match';
                    } else {
                        $modalScope.errors.password = null;
                    }
                });
            }]
        });
    };
}]);