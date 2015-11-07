'use strict';
/**
 *	Service to handle pulling data from riot
 */

var logger = require('../utilities/logger');
//Read the docs: https://www.npmjs.com/package/cron
var CronJob = require('cron').CronJob;

//Create and run a CronJob
var init = function(updateRate){

    if(!updateRate){
        //we need an update rate, this is not good!
        logger.error('No update rate provided, unable to start CronJob');
        return;
    }

    new CronJob(updateRate, function(){
        logger.info('Job is running!');
    }, null, true);
};



//Set which functions to make available
module.exports = {
    init: init
};