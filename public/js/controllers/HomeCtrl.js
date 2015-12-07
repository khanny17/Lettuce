'use strict';
// public/js/controllers/HomeCtrl.js
angular.module('HomeCtrl', ['RiotService'])
.controller('HomeController', ['$scope', 'Riot', function($scope, Riot) {

    $scope.matchSummaries = [];
    Riot.getMatches()
    .then(function(matches){
        $scope.matchSummaries = _.sortBy(matches, 'date').reverse();
    });

}]);