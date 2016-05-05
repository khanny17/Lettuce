//Service to handle pulling data from riot
'use strict';

var q = require('q');
var logger = require('../utilities/logger');
var config = require('../../config/config.js');
var lodash = require('lodash');
var apiCall = require('../utilities/apiHandler.js');

//All the models we will be updating
var TeamMatch = require('../models/teamMatch');
var Summoner = require('../models/summoner');
var Champion = require('../models/champion');
var Version = require('../models/version');
var MatchDetail = require('../models/matchDetail');
var ChampionMastery = require('../models/champMastery');


//Read the docs: https://www.npmjs.com/package/cron
var CronJob = require('cron').CronJob;

//Create and run a CronJob
var init = function(updateRate){

    if(!updateRate){
        //we need an update rate, this is not good!
        logger.error('No update rate provided, unable to start CronJob');
        return;
    }
    //Start the job to pull our data
    new CronJob(updateRate, RunUpdate, null, true);
};

//The main method that runs all our other updates
var RunUpdate = function(){
    logger.info('Riot update job is running');
    var promises = [
        update.summoners(config.riot.ourTeam),
        update.teamMatches(config.riot.teamId, config.riot.ourTeamName),
        update.champions(),
        update.masteries()
    ];

    //Save our promises and print any errors we have
    return q.allSettled(promises);
};

//Collection of all the different update functions for various data types
var update = {

    champions: function(){
        var deferred = q.defer();
        var url = config.riot.endpointUrls.champion;
        var thisVersionNumber, champions;
        apiCall(url)
        .then(function(championData){
            champions = championData.data;
            thisVersionNumber = championData.version;
            //compare version to the one we have - save us from updating unnecessarily
            return Version.getVersionNumber(config.riot.versionNames.champion);
        })
        .then(function(ourVersionNumber){
            //If our versions match, don't bother updating!
            if(thisVersionNumber !== ourVersionNumber){
                //Okay, we need to update then.
                //Create or update each champion
                lodash.forEach(champions, function(champion){
                    Champion.createOrUpdate(champion.id, champion.name,
                        champion.title, champion.image);
                }); 
                //Then save the new version
                //return so the chain will pass on the failure if it happens
                return Version.saveVersionNumber(config.riot.versionNames.champion,
                                                 thisVersionNumber);
            }
            var d = q.defer();
            d.resolve('Same Version numbers, no need to update');
            logger.debug('Not updating champions because we already have this version');
            return d.promise;
        })
        .then(deferred.resolve)
        .fail(deferred.reject);
        return deferred.promise;
    },

    match: function(id, winningTeamName, losingTeamName){
        var deferred = q.defer();
        var error;
        if(!id) {
            error = 'No match id provided';
            logger.error(error);
            deferred.reject(error);
            return deferred.promise;
        }

        var url = config.riot.endpointUrls.match;
        url += id; //append id to url

        apiCall(url)
        .then(function(matchDetails){
            //create the match detail object in db
            return MatchDetail.create(id, matchDetails, winningTeamName, losingTeamName);
        })
        .then(deferred.resolve)
        .fail(deferred.reject);

        return deferred.promise;
    },

    //Update our summoner data
    summoners: function(names){
        var deferred = q.defer();
        var error;
        if(!names){
            error = 'No summoner names provided, not updating any!';
            logger.warn(error);
            deferred.reject(error);
            return deferred.promise;
        }
        if(!names.length){
            error = 'Names is not an array!';
            logger.error(error);
            deferred.reject(error);
            return deferred.promise;
        }
        //convert array to csv list
        names = names.join(',');
        
        var base = config.riot.endpointUrls.summoner;
        var url = base + names;

        apiCall(url)
        .then(function(summonerData){
            //Convert json object with key-value to an array of just values
            var values = lodash.values(summonerData);
            var promises = [];
            lodash.forEach(values, function(summoner){
                promises.push(Summoner.create(summoner.id, summoner.name));
            });
            return q.all(promises);
        })
        .then(deferred.resolve)
        .fail(deferred.reject);
        return deferred.promise;
    },


    //Gets a summary of the team's matches and stored in db
    teamMatches: function(teamId, teamName){
        var deferred = q.defer();
        if(!teamId){
            var error = 'No team ID provided, i\'m not updating the team matches';
            logger.warn(error);
            deferred.reject(error);
            return deferred.promise;
        }

        var url = config.riot.endpointUrls.team + teamId;

        apiCall(url)
        .then(function(teamData){
            var matches = teamData[teamId].matchHistory;
            var promises = [];
            lodash.forEach(matches, function(match){
                //Now modify the match data to work with our schema
                var modelData = match;
                modelData.date = new Date(modelData.date); //change epoch millis to Date
                modelData.id = modelData.gameId; //make the "id" the game id
                modelData.teamId = teamId;
                delete modelData.gameId;
                //Create the summary
                promises.push(TeamMatch.create(modelData));              
            });
            return q.allSettled(promises); //wait for all to finish
        })
        .then(function(results){
            var promises = [];
            lodash.forEach(results, function(result){
                //only create new details for matches we didn't have
                if(result.state === 'fulfilled'){
                    var modelData = result.value;
                    //if we succeeded:, get the DETAILED match info:
                    if(!modelData){
                        logger.warn('Null match, not updating ');
                    } else if(modelData === config.errors.alreadyExists){
                        logger.debug('Match exists, not updating');
                    } else if(modelData.win){ //figure out which team won/lost
                        promises.push(
                            update.match(
                                modelData.id, teamName, modelData.opposingTeamName));
                    } else {
                        promises.push(
                            update.match(
                                modelData.id, modelData.opposingTeamName, teamName));
                    }
                }
            });
            return q.all(promises);
        })
        .then(deferred.resolve)
        .fail(deferred.reject);
        return deferred.promise;
    },
    masteries: function(){
        var deferred = q.defer();
        Summoner.getAll()
        .then(function(summoners){
            var error;
            if(!summoners || summoners.length===0) {
                error = 'No Summoners  found';
                logger.warn(error);
                deferred.reject(error);    
            }
            summoners = lodash.map(summoners, function(summoner){
                return summoner.id;
            });
            var base = config.riot.endpointUrls.champMastery;
            var promises = [];
            summoners.forEach(function(id){
                var url = base + id + '/champions';
                promises.push(apiCall(url));
            });
            return q.all(promises);
        })
        .then(function(masteries){
            masteries = lodash.flatten(masteries);
            var promises = [];
            masteries.forEach(function(championMastery){
            console.log(championMastery);

            promises.push(
                ChampionMastery.create(championMastery));
            });
            return q.all(promises);
        })
        .then(deferred.resolve)
        .fail(deferred.reject);
        return deferred.promise;
    }
};



//Set which functions to make available
module.exports = {
    init: init,
    update: update,
    RunUpdate: RunUpdate
};