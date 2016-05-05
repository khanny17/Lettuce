'use strict';

var mongoose = require('mongoose');
var logger = require('../utilities/logger');
var q = require('q');

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




var methods = {
    create: function(championMastery){
        var deferred = q.defer();
        console.log('DAD');
        ChampMastery.update({
            $and: [
                {playerId: championMastery.playerId},
                {championId: championMastery.championId}
            ]
        },
            championMastery,
        {
            upsert: true //Create if its not there bro ;)
        }, function(err, mastery){
            if(err){
                logger.error(err);
                deferred.reject(err);
                return;
            }
            logger.info('Added ChampMastery for ' +mastery.playerId + ' ' + 
                mastery.championId);
            deferred.resolve(mastery);
        });
            return deferred.promise;
    }
};


module.exports = {
    create: methods.create
};


 // "highestGrade": "S+",
 //      "championPoints": 114969,
 //      "playerId": 54680051,
 //      "championPointsUntilNextLevel": 0,
 //      "chestGranted": true,
 //      "championLevel": 5,
 //      "championId": 99,
 //      "championPointsSinceLastLevel": 93369,
 //      "lastPlayTime": 1461644811000