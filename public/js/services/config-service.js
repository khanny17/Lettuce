'use strict';
angular.module('Configuration', [])

.service('Config', ['$http', function($http) {
    var that = this;

    $http.get('/api/riot/getChampionVersion')
    .then(function(response){
        that.championImageUrlBase = 'http://ddragon.leagueoflegends.com/cdn/' +
        response.data + '/img/champion/';
    });
    
}]);