'use strict';
angular.module('CompController', ['ChampionService', 'NotificationService'])

.controller('compController', [
    '$scope',
    'comp', 
    'championService',
    'notificationService', 
    function($scope, comp, championService, notificationService) {
        
    $scope.comp = comp;
    
    championService.getChampions(function(champions){
        $scope.champions = champions;
    });

    //When a new user registers, we need to 
    //get their mastery data from the database
    notificationService.on('registered', function(){

    });
}]);