'use strict';
angular.module('SummonerService', ['NotificationService'])

//This module handles server calls for summoner data

.service('summonerService', ['$q', '$http', 'TeamName', 'notificationService',

function($q, $http, TeamName, notificationService){
    var that = this;
    //Current promise of request to get team summoners
    var teamSummoners = null;
    var teamSummonersPromise = null;

    var championMasteryCache = {
        //summonerName: {
        //  championId: champMastery
        //}
    };


    //"soft cache" the summoners on this team
    that.getTeamSummoners = function getTeamSummoners(forceRefresh) {
        if(!teamSummonersPromise || forceRefresh) {
            teamSummonersPromise = $http({
                url: '/api/summoner/get-by-team',
                method: 'GET',
                params: { teamname: TeamName.val } 
            })
            .then(function(response){
                teamSummoners = response.data;
                return teamSummoners;
            });
            return teamSummonersPromise;
        }

        return teamSummonersPromise;
    };

    //WARNING - this will get whatever we have at the time
    //Make sure you have already called "getTeamSummoners"
    //I know this is bad practice :(
    that.getTeamSummonersSynch = function (){
        return teamSummoners;
    };





    //Gives you the mastery level 
    //that a summoner has with a champion
    that.getMastery = function getMastery(summonerName, championID){
        return that.getSummonerMasteries(summonerName)
        .then(function(masteries){
            return masteries[championID];
        });
    };

    //I really hate that i keep doing this to myself
    that.getMasterySynch = function getMasterySynch(summonerName, championID) {
        var masteries = that.getSummonerMasteriesSynch(summonerName);
        if(!masteries) {
            return null;
        }
        return masteries[championID];
    };

    //Gets all champ masteries for the current team
    that.getTeamSummonerMasteries = function getTeamSummonerMasteries(forceRefresh) {
        that.getTeamSummoners(forceRefresh)
        .then(function(summoners){
            var promises = [];
            summoners.forEach(function(summoner){
                promises.push(that.getSummonerMasteries(summoner.name), forceRefresh);
            });
            return $q.all(promises);
        }, function(e){
            console.log(e);
        });
    };

    //Retrieves a summoner's masteries from the server, then 
    //stores them locally - a type of "soft-cache" if you will
    //We wont hit the server for all the champ masteries for that
    //summoner name again unless you pass a truthy value as
    //forceRefresh
    that.getSummonerMasteries = function(summonerName, forceRefresh) {
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
    that.getSummonerMasteriesSynch = function(summonerName) {
        summonerName = (summonerName || '').toLowerCase();
        return championMasteryCache[summonerName];
    };

    notificationService.on('registered', function(){
        that.getTeamSummonerMasteries(true);
    });


    that.getSummonerChampStats = function(summonerName) {
        return $http({
            url: '/api/summoner/get-champ-stats',
            method: 'GET',
            params: { summoner: summonerName } 
        })
        .then(function(response){
            return response.data;
        }, function(e){
            console.error(e);
        });
    };
}]);