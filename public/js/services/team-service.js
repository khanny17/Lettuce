'use strict';
angular.module('TeamService', [])

.service('teamService', ['$http', function($http){
    var teamNames;


    this.getTeamNames = function(callback){
        if(!teamNames){
            return $http.get('/api/team/team-names')
            .then(function(resp){
                teamNames = resp.data || [];
                return callback(teamNames);
            });
        } 

        return callback(teamNames);
    };

    this.createTeam = function(teamData, cb, errorCb){
        if(!teamData){
            return errorCb('No team data given');
        }

        //More front end validation here maybe?

        return $http.post('/api/team/create', teamData)
        .then(function(resp){
            return cb(resp.data);
        })
        .catch(errorCb);
    };
}]);