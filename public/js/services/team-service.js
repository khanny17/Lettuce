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
            //Possibly add team to teamNames cache that we have?
            return cb(resp.data);
        })
        .catch(errorCb);
    };

    this.searchTeams = function(query, cb, errorCb){
        if(!query){
            return errorCb('No team name given');
        }

        return $http({
            url: '/api/team/find',
            method: 'GET',
            params: { name: query } 
        })
        .then(function(resp){
            return cb(resp.data);
        })
        .catch(function(error){
            if(error && error.data){
                errorCb(error.data);
            } else {
                errorCb('Sorry! An error has occurred');
            }
        });
    };
}]);