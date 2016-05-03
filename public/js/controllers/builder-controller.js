'use strict';
angular.module('BuilderController', ['ChampionService'])

.controller('builderController', ['$scope', 'championService',
    function($scope, championService) {

    championService.getChampions(function(champions){
        $scope.champions = champions;
    });

    $scope.lanes = [
        { name: 'Top' },
        { name: 'Jungle' },
        { name: 'Middle' },
        { name: 'ADC' },
        { name: 'Support' }
    ];
    
}]);