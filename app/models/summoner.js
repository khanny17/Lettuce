'use strict';
//models/summoner.js

var mongoose = require('mongoose');
var logger = require('../utilities/logger');
var q = require('q');
var Summoner = mongoose.model('Summoner', {
    id: Number,
    name: String
});


var methods = {
    //Creates Summoner or updates if already exists
    create: function(id, name){
        var deferred = q.defer();
        //Params: query, object, options, callback
        Summoner.update({
            name: name
        },{
            id: id,
            name: name
        },{
            upsert: true //Create if it doesn't exist
        }, function(err){
            if(err){
                logger.error(err);
                deferred.reject(err);
                return;
            }
            logger.info('Created/Updated summoner: ' + name);
            deferred.resolve();
        });
        return deferred.promise;
    },

    getOneByName: function(name){
        var deferred = q.defer();
        Summoner.find({
            name: name
        }, function(err, summoners){
            if(err){
                logger.error(err);
                deferred.reject(err);
            } else if(summoners > 1){
                logger.warn('More than one summoner exists with name: ' + name);
            }

            deferred.resolve(summoners[0]); //only return ONE
        });
        return deferred.promise;
    },

    getAll: function(){
        var deferred = q.defer();

        Summoner.find({}, function(err, summoners){
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