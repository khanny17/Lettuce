'use strict';

var mongoose        = require('mongoose');
var logger               = require('../utilities/logger');
var q                       = require('q');

//Set up a mongoose model
var ChampMastery = mongoose.model('ChampMastery', {
    championId: Number,
    championLevel: Number,
    championPoints: Number,
    championPointsSinceLastLevel: Number,
    championPointsUntilNextLevel: Number,
    chestGranted: Boolean,
    highestGrade: String,
    lastPlayTIme: Number,
    playerId: Number
});

/**
*This model handles champion mastery in relation to the database.
**/


var methods = {
    create: function(championMastery){
        var deferred = q.defer();
        ChampMastery.update({
            $and: [
            {playerId: championMastery.playerId},
            {championId: championMastery.championId}
            ]
        }, championMastery, {
            upsert: true 
        }, function(err){
            if(err){
                logger.error(err);
                deferred.reject(err);
                return;
            }
            deferred.resolve();
        });
        return deferred.promise;
    },

    getByPlayerId: function(playerId) {
        var deferred = q.defer();

        if(!playerId){
            deferred.reject('No playerId given');
            logger.warn('No playerId given');
            return deferred.promise;
        }
        ChampMastery.find({
            playerId: playerId
        }, function(err, results){
            if(err){
                logger.error(err);
                deferred.reject(err);
            }
            deferred.resolve(results);
        });

        return deferred.promise;
    }
};


module.exports = {
    create: methods.create,
    getByPlayerId: methods.getByPlayerId
};
