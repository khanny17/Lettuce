'use strict';


var mongoose = require('mongoose');
var logger = require('../utilities/logger');
var q = require('q');


var ChampWinRate = mongoose.model('ChampWinRate', {
    championId: Number,
    normalWinRate: Number,
    masteryWinRate: Number
});
/**
*This is where we take the winRateArray we created and store it in the database.
**/

var methods = {
    create: function(champWinRate){
        var deferred = q.defer();
        ChampWinRate.update({
            $and: [ 
                {championId: champWinRate.championId}
            ]
        },
            champWinRate,
        {
            upsert: true 
        }, function(err,winRate){
            if(err){
                logger.error(err);
                deferred.reject(err);
                return;
            }
            logger.info('Added WinRate for ' + winRate.championId);
            deferred.resolve(winRate);
        });
        return deferred.promise;
        
    }
};

module.exports = {
    create: methods.create
};