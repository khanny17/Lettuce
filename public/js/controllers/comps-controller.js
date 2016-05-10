'use strict';
angular.module('CompsController', ['CompService', 'CreateCompModal', 'ChampionService'])

.controller('compsController', [
    '$scope',
    'comps', 
    'createCompModal', 
    'championService',

    function($scope, comps, createCompModal, championService) {

        $scope.comps = comps;

        $scope.openCreateCompModal = function() {
            createCompModal.open();
        };

        championService.getChampions(function(){

            $scope.getImage = function(id){
                if(!id) {
                    return '';
                }
                return championService.getImageByChampID(id);
            };
        });
    }
]);