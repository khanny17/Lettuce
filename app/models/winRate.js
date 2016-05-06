'use strict';


var mongoose = require('mongoose');
var logger = require('../utilities/logger');
var q = require('q');


var ChampWinRate = mongoose.model('ChampWinRate', {
    championId: Number,
    normWinRate: Number,
    masteryWinRate: Number
});


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