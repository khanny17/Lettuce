//Service to handle pulling data from riot
'use strict';

var https = require('https');
var q = require('q');
var logger = require('../utilities/logger');
var config = require('../../config/config.js');
var _ = require('lodash');

//All the models we will be updating
var TeamMatch = require('../models/teamMatch');
var Summoner = require('../models/summoner');
var Champion = require('../models/champion');
var Version = require('../models/version');
var MatchDetail = require('../models/matchDetail');


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
        update.teamMatches(config.riot.teamId),
        update.champions()
    ];

    //Save our promises and print any errors we have
    q.all(promises)
    .fail(function(error){
        logger.error(error);
    });
};

//Collection of all the different update functions for various data types
var update = {

    champions: function(){
        var deferred = q.defer();
        var url = config.riot.endpointUrls.champion;
        var thisVersionNumber, champions;
        helpers.getJSON(url)
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
                _.forEach(champions, function(champion){
                    Champion.createOrUpdate(champion.id, champion.name, champion.title);
                }); 
                //Then save the new version
                //return so the chain will pass on the failure if it happens
                return Version.saveVersionNumber(config.riot.versionNames.champion,
                                                 thisVersionNumber);
            }
        })
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

        helpers.getJSON(url)
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

        helpers.getJSON(url)
        .then(function(summonerData){
            //Convert json object with key-value to an array of just values
            var values = _.values(summonerData);
            _.forEach(values, function(summoner){
                Summoner.create(summoner.id, summoner.name);
            });
            deferred.resolve();
        })
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

        helpers.getJSON(url)
        .then(function(teamData){
            var matches = teamData[teamId].matchHistory;
            logger.debug(JSON.stringify(teamData,null,4));
            _.forEach(matches, function(match){
                //Now modify the match data to work with our schema
                var modelData = match;
                modelData.date = new Date(modelData.date); //change epoch millis to Date
                modelData.id = modelData.gameId; //make the "id" the game id
                modelData.teamId = teamId;
                delete modelData.gameId;
                //Create the summary
                TeamMatch.create(modelData)
                .then(function(){
                    //if we succeeded:, get the DETAILED match info:
                    if(match.win){ //figure out which team won/lost
                        update.match(match.gameId, teamName, match.opposingTeamName);
                    } else {
                        update.match(match.gameId, match.opposingTeamName, teamName);
                    }
                });                
            });
            deferred.resolve();
        })
        .fail(deferred.reject);
        return deferred.promise;
    }
};

var helpers = {
    getJSON: function(url){
        var deferred = q.defer();
        logger.debug(url + '?api_key=' + config.riot.apiKey);
        //Make the request to Rito
        https.get(url + '?api_key=' + config.riot.apiKey, function(res){
            //String to hold our data as we get it
            var body = '';
            res.on('data', function(d){
                body += d;
            });

            res.on('error', deferred.reject);


            //The actual logic
            res.on('end', function(){
                //Take the string response and convert to JSON
                var object = JSON.parse(body);
                deferred.resolve(object);
            });
        });
        return deferred.promise;
    }
};



//Set which functions to make available
module.exports = {
    init: init,
    update: update,
    RunUpdate: RunUpdate
};