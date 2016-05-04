'use strict';
angular.module('CompsController', ['CompService', 'CreateCompModal'])

.controller('compsController', ['$scope', '$uibModal', 'comps', 'createCompModal',

function($scope, $uibModal, comps, createCompModal) {

    $scope.comps = comps;

    $scope.openCreateCompModal = function() {
        createCompModal.open();
    };

}]);