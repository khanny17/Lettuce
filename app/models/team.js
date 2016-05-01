'use strict';

var mongoose = require('mongoose');
var logger = require('../utilities/logger');
var lodash = require('lodash');
var q = require('q');
var Team = mongoose.model('Team', {
    name: { type: String, unique: true, required: true } 
    //TODO this is not being validated somehow... 
    //I think it is because we need to wipe our db or something
});


var methods = {
    //Creates team, throwing error if it already exists
    create: function(team){
        var deferred = q.defer();

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

        Team.find({
            'name': {
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
    }
};
 
module.exports = {
    create: methods.create,
    getAllTeamNames: methods.getAllTeamNames,
    findByName: methods.findByName
};