'use strict';
angular.module('CompService', [])

//Handles comp data

.service('compService', ['$http', function($http){
    this.create = function(comp) {
        return $http.post('api/comp/create', { comp: comp })
        .then(function(response){
            return response.data;
        });
    };

    this.get = function(compID) {
        return $http({
            url: '/api/comp/get',
            method: 'GET',
            params: { id: compID } 
        })
        .then(function(response){
            return response.data;
        });
    };
}]);