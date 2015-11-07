'use strict';
/**
 *	Service to handle pulling data from riot
 */

var https = require('https');
var logger = require('../utilities/logger');
var config = require('../../config/config.js');
var _ = require('lodash');
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
    new CronJob(updateRate, function(){
        logger.info('Riot update job is running');
        update.summoners(['khanny17', 'crappycupojoe']);


    }, null, true, "America/Los_Angeles");
};

//Collection of all the different update functions for various data types
var update = {
    summoners: function(names){
        if(!names){
            logger.warn('No summoner names provided, not updating any!');
            return;
        }
        if(!names.length){
            logger.error('Names is not an array!');
        }

        console.log("yoooo");
        //convert array to csv list
        names = names.join(',');
        
        var base = config.riot.endpointUrls.summoner;
        var url = base + names + '?api_key=' + config.riot.apiKey;

        //Make the request to Rito
        https.get(url, function(res){
            //String to hold our data as we get it
            var body = '';
            res.on('data', function(d){
                body += d;
            });


            //The actual logic
            res.on('end', function(){
                var object = JSON.parse(body);
                var summonerData = _.values(object);
                //Now we have an array of the summoner objects
                Summoner.create(summonerData[0]);
            });
        });
    }
}



//Set which functions to make available
module.exports = {
    init: init
};