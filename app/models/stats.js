'use strict';


var mongoose = require('mongoose');
var logger = require('../utilities/logger');
var q = require('q');



var ChampStats = mongoose.model('ChampStats', {
    summonerId: Number,
    listOfChamps: {}
    
});

/**
*This will store champion stats for a summoner.
**/
var methods = {
    create: function(champStats){
        var deferred = q.defer();
        ChampStats.update({
                summonerId: champStats.summonerId
        },
            champStats,
        {
            upsert: true 
        }, function(err,champStat){
            if(err){
                logger.error(err);
                deferred.reject(err);
                return;
            }
            logger.info('Added Stats for ' + champStat.summonerId);
            deferred.resolve(champStat);
        });
        return deferred.promise;
        
    }
};

module.exports = {
    create: methods.create
};