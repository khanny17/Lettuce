'use strict';
//models/teamMatch.js

/**
 * This model holds a short summary of the matches for a given team
 * More detailed information is stored in a MatchDetail object
 * in a separate table
 */

var mongoose = require('mongoose');
var logger = require('../utilities/logger');
var q = require('q');
var TeamMatch = mongoose.model('Match', {
    id: { type: Number, unique: true }, //This is taken from the "gameId" field
    teamId: String, //The Id of our team (or whatever team this game was played by)
    gameMode: String, //Type of game (typically CLASSIC)
    mapId: Number, //not sure...
    assists: Number,
    opposingTeamName: String,
    invalid: Boolean,
    deaths: Number,
    kills: Number,
    win: Boolean,
    date: Date, //Comes from riot as epoch milliseconds -> convert BEFORE it comes here
    opposingTeamKills: Number
});


var methods = {
    //Creates a match if possible or rejects promise if there was an error
    create: function(modelData){
        var deferred = q.defer();
        //Params: query, object, options, callback
        TeamMatch.create(modelData, function(err){
            if(err){
                logger.warn(err);
                deferred.reject(err);
                return;
            }
            logger.info('Created Match Summary: ' + modelData.id);
            deferred.resolve();
        });
        return deferred.promise;
    },

    getOneById: function(id){
        var deferred = q.defer();
        TeamMatch.find({
            id: id
        }, function(err, summoners){
            if(err){
                logger.error(err);
                deferred.reject(err);
            } else if(summoners > 1){
                logger.warn('More than one match exists with id: ' + id);
            }

            deferred.resolve(summoners[0]); //only return ONE
        });
        return deferred.promise;
    },

    getAll: function(){
        var deferred = q.defer();

        TeamMatch.find({}, function(err, summoners){
            if(err){
                deferred.reject(err);
            }
            deferred.resolve(summoners);
        });

        return deferred.promise;
    }
};

module.exports = {
    create: methods.create,
    getOneById: methods.getOneById
};