#!/usr/bin/env node
'use strict';
require('dotenv').load();
var config = require(__dirname + '/config/config');
var lodash = require('lodash');
var logger = require(__dirname + '/app/utilities/logger');
var mongoose = require('mongoose');


mongoose.connect(config.db.url, {authMechanism: 'ScramSHA1'}); 



/**
 *  Run all the updates, then exit the process. log all errors before exiting
 */
logger.info('Starting update job');
require('./app/services/riot').RunUpdate()
.then(function(results){
    var exitCode = 0;
    lodash.forEach(results, function(result){
        if(result.state === 'rejected'){
            exitCode = 1;
            logger.error(result.value);
        }
    });
    if(exitCode === 0){
        logger.info('Update job completed successfully');
    }
    process.exit(exitCode);
})
.fail(function(error){
    logger.error(error);
    process.exit(1);
});