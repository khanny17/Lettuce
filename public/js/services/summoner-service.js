'use strict';
angular.module('SummonerService', [])

//This module handles server calls for summoner data

.service('summonerService', ['$q', '$http', 'TeamName',

    function($q, $http, TeamName){
    
    var teamSummoners = null;
    var championMasteryCache = {
        //summonerName: {
        //  championId: champMastery
        //}
    };


    //"soft cache" the summoners on this team
    this.getTeamSummoners = function getTeamSummoners() {
        if(!teamSummoners) {
            return $http({
                url: '/api/summoner/get-by-team',
                method: 'GET',
                params: { teamname: TeamName.val } 
            })
            .then(function(response){
                teamSummoners = response.data;
                return teamSummoners;
            });
        }

        return $q.when(teamSummoners);
    };

    //WARNING - this will get whatever we have at the time
    //Make sure you have already called "getTeamSummoners"
    //I know this is bad practice :(
    this.getTeamSummonersSynch = function (){
        return teamSummoners;
    };





    //Gives you the mastery level 
    //that a summoner has with a champion
    this.getMastery = function getMastery(summonerName, championID){
        return this.getSummonerMasteries(summonerName)
        .then(function(masteries){
            return masteries[championID];
        });
    };

    //Retrieves a summoner's masteries from the server, then 
    //stores them locally - a type of "soft-cache" if you will
    //We wont hit the server for all the champ masteries for that
    //summoner name again unless you pass a truthy value as
    //forceRefresh
    this.getSummonerMasteries = function(summonerName, forceRefresh) {
        //lowercase the summoner name
        summonerName = (summonerName || '').toLowerCase();

        if(championMasteryCache[summonerName] && !forceRefresh) {
            return $q.when(championMasteryCache[summonerName]);
        }

        return $http({
            url: '/api/champ-mastery/get-by-summoner-name',
            method: 'GET',
            params: { summonerName: summonerName } 
        })
        .then(function(response){
            championMasteryCache[summonerName] = {};
            //Map champ mastery to key, using champion id. this provides
            //faster access at the expense of some up front work
            response.data.forEach(function(mastery){
                championMasteryCache[summonerName][mastery.championId] = mastery;
            });
            return championMasteryCache[summonerName];
        });
    };

    //Returns whatever we have, regardless of if we hit the
    //server yet. BE CAREFUL when using this that you have
    //already loaded the summoner masteries
    //for that summoner
    this.getSummonerMasteriesSynch = function(summonerName) {
        summonerName = (summonerName || '').toLowerCase();
        return championMasteryCache[summonerName];
    };
}]);