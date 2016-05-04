'use strict';
angular.module('CompsController', ['CompService'])

.controller('compsController', ['$scope', '$uibModal',


function($scope, $uibModal) {

    $scope.openCreateCompModal = function() {
        var modalInstance = $uibModal.open({
            templateUrl: 'views/templates/create-comp-modal.html',
            size: 'sm',
            controller: ['$scope', 'compService', '$state',
            function($modalScope, compService, $state){
                $modalScope.comp = {
                    name: ''
                };

                $modalScope.create = function() {
                    compService.create($modalScope.comp)
                    .then(function(comp) {
                        modalInstance.close();
                        $state.go('team.comp', { compID:comp._id });
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