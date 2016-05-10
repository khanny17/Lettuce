'use strict';


var mongoose = require('mongoose');
var logger = require('../utilities/logger');
var q = require('q');

/**
 * This data is taken from the Riot api and modified by us. The main adjustments
 *  we make to the data are:
 *    - Extract the match Id from the Detail object
 *    - Normalize Participant Data by:
 *        - removing the match specific id
 *        - storing the summoner name and summoner id
 *    - Take the Team[] array from the api and convert it into two objects.
 *    - For each Team object, remove id, replace with ranked team name (or null if none)
 */
var MatchDetail = mongoose.model('MatchDetail', {
    id: Number, //Taken from the matchId field
    Detail: Object, //An object containing details about the match itself
    Participants: Object, //An array of details about the players in the match
    BlueTeam: Object,
    PurpleTeam: Object
});


var methods = {
    createFromApiData: function(id, apiData, winningTeamName, losingTeamName){
        var deferred = q.defer();
        var normalized = helpers.normalize(id,apiData,winningTeamName,losingTeamName);
        MatchDetail.update({
            id: id
        }, normalized,{
            upsert: true //Create if it doesn't exist
        }, function(err){
            if(err){
                logger.error(err);
                deferred.reject(err);
                return;
            }
            logger.info('Created/Updated Match: ' + id);
            deferred.resolve(normalized);
        });

        return deferred.promise;
    }
};
// This is where we take apart the data. eg: matchDuration, matchCreation, etc..
var helpers = {
    normalize: function(id, matchDetails, winningTeamName, losingTeamName){
        var normalized = {};
        normalized.id = id;
        normalized.Detail = {};
        normalized.Detail.duration = matchDetails.matchDuration;
        normalized.Detail.creation = matchDetails.matchCreation;
        normalized.Detail.season = matchDetails.season;
        normalized.Participants = matchDetails.participants;
        //insert team names
        if(matchDetails.teams[0].winner){
            matchDetails.teams[0].name = winningTeamName;
            matchDetails.teams[1].name = losingTeamName;
        } else {
            matchDetails.teams[0].name = losingTeamName;
            matchDetails.teams[1].name = winningTeamName;
        }
        //move to BlueTeam/PurpleTeam objects
        if(matchDetails.teams[0].id === 100){
            normalized.BlueTeam = matchDetails.teams[0];
            normalized.PurpleTeam = matchDetails.teams[1];
        } else {
            normalized.BlueTeam = matchDetails.teams[1];
            normalized.PurpleTeam = matchDetails.teams[0];
        }
        return normalized;
    }

};


module.exports = {
    create: methods.createFromApiData
};