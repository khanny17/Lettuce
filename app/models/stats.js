'use strict';


var mongoose = require('mongoose');
var logger = require('../utilities/logger');
var q = require('q');

// This will store champion stats for a summer based on mastery. 
var ChampStats = mongoose.model('ChampStats', {
    summonerId: Number,
    listOfChamps: {}
    
});


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