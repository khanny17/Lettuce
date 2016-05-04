'use strict';
angular.module('CompService', [])

//Handles comp data

.service('compService', ['$http', 'TeamName',
    function($http, TeamName){

    this.create = function(comp) {
        comp.teamname = TeamName.val;
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

    this.getTeamComps = function() {
        return $http({
            url: '/api/comp/getTeamComps',
            method: 'GET',
            params: { teamname: TeamName.val } 
        })
        .then(function(response){
            return response.data;
        });
    };
}]);