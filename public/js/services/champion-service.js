'use strict';
angular.module('ChampionService', [])

.service('championService', ['$http', function($http){
    var champions;
    this.getChampions = function(callback) {
        if(!champions) {
            return $http.get('/api/riot/getChampions')
            .then(function(response){
                champions = response.data;
                return callback(champions);
            });
        }

        return callback(champions);
    };
}]);