//Service to handle pulling data from riot
'use strict';

var https = require('https');
var q = require('q');
var logger = require('../utilities/logger');
var config = require('../../config/config.js');
var _ = require('lodash');
var TeamMatch = require('../models/teamMatch');
var Summoner = require('../models/summoner');
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
        update.teamMatches(config.riot.teamId)
    ];

    //Save our promises and print any errors we have
    q.all(promises)
    .fail(function(error){
        logger.error(error);
    });
};

//Collection of all the different update functions for various data types
var update = {

    champion: function(){
        var deferred = q.defer();
        var url = config.riot.endpointUrls.champion;

        helpers.getJSON(url)
        .then(function(championData){
            logger.debug(JSON.stringify(championData, null, 4));
/*
            var matches = teamData[teamId].matchHistory;
            logger.debug(JSON.stringify(teamData,null,4));
            _.forEach(matches, function(match){
                //Now modify the match data to work with our schema
                var modelData = match;
                modelData.date = new Date(modelData.date); //change epoch millis to Date
                modelData.id = modelData.gameId; //make the "id" the game id
                modelData.teamId = teamId;
                delete modelData.gameId;
                TeamMatch.create(modelData);
            });
*/       })
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
    teamMatches: function(teamId){
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
                TeamMatch.create(modelData);
                deferred.resolve();
            });
        })
        .fail(deferred.reject);
        return deferred.promise;
    }
};

var helpers = {
    getJSON: function(url){
        var deferred = q.defer();
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
    update: update
};