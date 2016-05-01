'use strict';
angular.module('TeamService', [])

.service('teamService', ['$http', '$location', function($http, $location){
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
                return errorCb(error.data);
            } else {
                return errorCb('Sorry! An error has occurred');
            }
        });
    };

    this.getTeam = function(teamName) {
        return $http({
            url: '/api/team/get',
            method: 'GET',
            params: { name: teamName }
        })
        .then(function(resp){
            return resp.data;
        });
    };

    this.buildTeamUrl = function(teamName, currentTeamName) {
        var subdomain = $location.host().split('.')[0];
        var newUrl = $location.absUrl();
        newUrl = newUrl.replace($location.path(), ''); //remove path


        if(subdomain === 'www' || subdomain === currentTeamName.toLowerCase()) {
            newUrl = newUrl.replace(subdomain, teamName);
            return newUrl;
        } else { //this would imply no subdomain exists
            var protocol = $location.protocol();
            newUrl = newUrl.replace(protocol + '://', ''); //remove protocol
            newUrl = protocol + '://' + teamName + '.' + newUrl;
            return newUrl;
        }

        return newUrl;
    };
}]);