'use strict';
//models/teamMatch.js

var mongoose = require('mongoose');
var logger = require('../utilities/logger');
var q = require('q');
var TeamMatch = mongoose.model('Match', {
    id: Number, //This is taken from the "gameId" field
    teamId: String, //The Id of our team (or whatever team this game was played by)
    gameMode: String, //Type of game (typically CLASSIC)
    mapId: Number, //not sure...
    assists: Number,
    opposingTeamName: String,
    invalid: Boolean,
    deaths: Number,
    kills: Number,
    win: Boolean,
    date: Date, //This comes from riot as epoch milliseconds, so we convert BEFORE it comes to this module
    opposingTeamKills: Number
});


var methods = {
    //Creates Summoner or updates if already exists
    create: function(modelData){
        var deferred = q.defer();
        //Params: query, object, options, callback
        TeamMatch.update({
            id: modelData.id
        }, modelData ,{
            upsert: true //Create if it doesn't exist
        }, function(err){
            if(err){
                logger.error(err);
                deferred.reject(err);
                return;
            }
            logger.info('Created/Updated Match: ' + name);
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
    getOneByName: methods.getOneByName
};