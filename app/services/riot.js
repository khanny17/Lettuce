//Service to handle pulling data from riot
'use strict';

var q = require('q');
var logger = require('../utilities/logger');
var config = require('../../config/config.js');
var lodash = require('lodash');
var apiCall = require('../utilities/apiHandler.js');

//All the models we will be updating
var Summoner = require('../models/summoner');
var Champion = require('../models/champion');
var Version = require('../models/version');
var MatchDetail = require('../models/matchDetail');
var ChampionMastery = require('../models/champMastery');
var WinRate = require('../models/winRate');
var Stats = require('../models/stats');


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
        update.champions(),
        update.champMasteries(),
        update.winRateFinder(),
        update.statFinder()
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
                    Champion.createOrUpdate({
                        id: champion.id,
                        name: champion.name,
                        title: champion.title,
                        image: champion.image,
                        roles: champion.tags
                    });
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

    //Pulls Match data from a id from RIOT API then called MatchDetail to play with
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
    /**
    *Update our summoner data
    **/   
    summoners: function(names){
        var deferred = q.defer();
        var error;
        if(!names || names.length <= 0){
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
    /**
    *Pulls champ mastery data from RIOT API using summoner Id's 
    *and calls our ChampionMastery Model!
    **/
    champMasteries: function(summonerName){
        var deferred = q.defer();
        //if they give a name, get just that one's masteries.
        //if they dont, get them all
        logger.info('Updating champion masteries for ' +
                    (summonerName ? summonerName : 'all summoners'));
        (summonerName ?
        Summoner.getOneByName(summonerName) :
        Summoner.getAll())
        .then(function(summoners){
            var error;
            //Hack for when we call getOneByName
            //to turn it into an array
            var checkLen = summoners.length >= 0;
            if(!checkLen){
                summoners = [summoners];
            }

            if(!summoners || summoners.length <= 0) {
                error = 'No Summoners  found';
                logger.warn(error);
                deferred.resolve(error); 
                throw 'No Summoners'; 
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
                promises.push(
                    ChampionMastery.create(championMastery)
                );
            });
            return q.all(promises);
        })
        .then(deferred.resolve)
        .fail(function(err){
            deferred.reject(err);
        });
        return deferred.promise;
    },
    /**
    *Takes summoners and finds there matches and pulls if they won or not and stores 
    *it in database to determine winRate for a summoner on a champion
    **/
    winRateFinder: function(){
        var deferred = q.defer();
        Summoner.getAll()
        .then(function(summoners){
            var error;
            if(!summoners || summoners.length === 0) {
                error = 'No Summoners  found';
                logger.warn(error);
                deferred.reject(error);    
            }
            summoners = lodash.map(summoners, function(summoner){
                return summoner.id;
            });
            var base = config.riot.endpointUrls.game;
            var promises = [];
            summoners.forEach(function(id){
                var url = base + id  +'/recent';
                promises.push(apiCall(url));
            });
            return q.all(promises);
        })
        .then(function(summonerGamePairs){
            var arrayOfArrays = lodash.map(summonerGamePairs, function(summonerGamePair){
                return summonerGamePair.games;
            });
            var arrayOfGames = lodash.flatten(arrayOfArrays); // A list of Games
            var champWinRateArray = [{
                championId: 8,
                normalWinRate: 1,
                masteryWinRate: 1
            }]; 
            var totalGames = 0;
            arrayOfGames.forEach(function(game){ // Iterating though a list of games
              
                if (String(game.stats.win) === 'true'){
                      totalGames++;
                    var found = champWinRateArray.some(function(partOfArray){
                        return partOfArray.championId === game.championId;
                    });
                    // Checking for duplicate chamions in the array
                    if (!found ){
                        champWinRateArray.push({
                            championId: game.championId,
                            normalWinRate: 1,
                            masteryWinRate: 1
                        });
                    } else{
                        for (var i = 0; i < champWinRateArray.length; i++){
                            if (champWinRateArray[i].championId === game.championId){
                                champWinRateArray[i].normalWinRate++;
                            }
                        }
                    } 
                } 
            });
            champWinRateArray.forEach(function(champWinRate){
                WinRate.create(champWinRate);
           });
           

        });
    },
    /**
    *This will pull champion stats for each summoner in our database.
    *Once pulled we store them using our stats model so they can be displayed.
    **/
    statFinder: function(){
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
            var base = config.riot.endpointUrls.stats;
            var promises = [];
            summoners.forEach(function(id){
                var url = base + id  +'/ranked?season=SEASON2016';
                promises.push(apiCall(url));
            });
            return q.all(promises);
        })
        .then(function(summonerStats){
            var champStats = [];
            summonerStats.forEach(function(sumStats){
                // Passing in the summonerId and them a list of champions stats.
                champStats.push({
                    summonerId: sumStats.summonerId,
                    listOfChamps: sumStats.champions
                });
            });
            champStats.forEach(function(ChampStats){
                Stats.create(ChampStats);
            });
        });
    }
};


//Set which functions to make available
module.exports = {
    init: init,
    update: update,
    RunUpdate: RunUpdate
};