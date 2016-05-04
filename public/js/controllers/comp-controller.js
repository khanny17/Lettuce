'use strict';
angular.module('CompController', ['ChampionService'])

.controller('compController', ['$scope', 'comp', 'championService',
    function($scope, comp, championService) {
        
    $scope.comp = comp;
    
    championService.getChampions(function(champions){
        $scope.champions = champions;
    });
}]);