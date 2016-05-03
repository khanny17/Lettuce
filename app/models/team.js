'use strict';

var mongoose = require('mongoose');
var logger = require('../utilities/logger');
var lodash = require('lodash');
var q = require('q');
var Team = mongoose.model('Team', {
    name: { type: String, unique: true, required: true }, 
    nameLower: { type: String, unique: true, required: true } //lowercase copy of the name
    //TODO this is not being validated somehow... 
    //I think it is because we need to wipe our db or something
});


var methods = {
    //Creates team, throwing error if it already exists
    create: function(team){
        var deferred = q.defer();

        //TODO validation!!

        //Save lowercase copy of name
        team.nameLower = team.name.toLowerCase();
        //We should remove weird characters

        Team.create(team, function(err, result){
            if(err){
                logger.error(err);
                deferred.reject(err);
                return;
            }
            logger.info('Created team: ' + result.name);
            deferred.resolve(result);
        });

        return deferred.promise;
    },

    getAllTeamNames: function(){
        var deferred = q.defer();

        Team.find({}, 'name', function(err, results){
            if(err){
                logger.error(err);
                deferred.reject(err);
            }
            var names = lodash.map(results, function(result){
                return result.name;
            });
            deferred.resolve(names);
        });

        return deferred.promise;
    },

    findByName: function(name){
        var deferred = q.defer();

        if(!name || typeof name !== 'string'){
            deferred.reject('Invalid name given');
            logger.warn('Invalid name given');
            return deferred.promise;
        }

        name = name.toLowerCase();

        Team.find({
            'nameLower': {
                '$regex': name,
                '$options': 'i'
            }
        }, function(err, results){
            if(err){
                logger.error(err);
                deferred.reject(err);
            }
            deferred.resolve(results);
        });

        return deferred.promise;
    },

    get: function(name){
        var deferred = q.defer();

        if(!name || typeof name !== 'string'){
            deferred.reject('Invalid name given');
            logger.warn('Invalid name given');
            return deferred.promise;
        }

        name = name.toLowerCase();

        Team.findOne({
            'nameLower': name
        }, function(err, result){
            if(err){
                logger.error(err);
                return deferred.reject(err);
            }
            
            if(!result){
                logger.error(name + ' not found');
                return deferred.reject(name + ' not found');
            }

            return deferred.resolve(result);
        });

        return deferred.promise;
    }
};
 
module.exports = {
    create: methods.create,
    getAllTeamNames: methods.getAllTeamNames,
    findByName: methods.findByName,
    get: methods.get
};