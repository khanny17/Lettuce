'use strict';
angular.module('TeamService', [])

//This service handles all the server calls related to the team

.service('teamService', ['$http', '$location', 'TeamName',
    function($http, $location, teamName){
    var teamNames;

    //Get a list of all the team names that have registered with our site
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

    //Create a team with the given data
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

    //Find all teams matching the given string
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

    //Get a team with the matching teamname
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

    //This doesnt actually hit the server. This is some complicated bullshit
    //because of the subdomain thing.
    //It takes a teamname and the current team name (ie the current subdomain)
    //and makes the url to the other team
    //ie:
    //http://www.lettucelol.com -> http://myteam.lettucelol.com
    //The reason its so complicated is because sometimes our url is localhost,
    //and sometimes our url is lettucelol.com
    //#struggle
    this.buildTeamUrl = function(teamName, currentTeamName) {
        var domains = $location.host().split('.');
        teamName = teamName.split(' ').join('-');
        var subdomain;
        if(domains.length >= 2) {
            subdomain = $location.host().split('.')[0];
        }        

        var newUrl = $location.absUrl();
        newUrl = newUrl.replace($location.path(), ''); //remove path

        if(currentTeamName && 
            (subdomain === 'www' || subdomain === currentTeamName.toLowerCase())) {
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

    this.goToTeamPage = function(name) {
        window.open(this.buildTeamUrl(name, teamName.val), '_blank'); 
    };
}]);