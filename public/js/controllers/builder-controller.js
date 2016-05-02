'use strict';
angular.module('BuilderController', ['ChampionService'])

.controller('builderController', ['$scope', 'championService',
    function($scope, championService) {

    championService.getChampions(function(champions){
        $scope.champions = champions;
    });
    
}]);