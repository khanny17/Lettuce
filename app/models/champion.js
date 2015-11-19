'use strict';
//models//Champion.js

var mongoose = require('mongoose');
var logger = require('../utilities/logger');
var q = require('q');
var Champion = mongoose.model('Champion', {
    id: Number, //This is taken from the "gameId" field
    name: String,
    title: String //eg "The Dark Child"
});


var methods = {
    //Creates Champion or updates if already exists
    createOrUpdate: function(id, name, title){
        var deferred = q.defer();
        //Params: query, object, options, callback
        Champion.update({
            id: id
        }, {
            id: id,
            name: name,
            title: title
        } ,{
            upsert: true //Create if it doesn't exist
        }, function(err){
            if(err){
                logger.error(err);
                deferred.reject(err);
                return;
            }
            logger.info('Created/Updated Champion: ' + id);
            deferred.resolve();
        });
        return deferred.promise;
    },

    getOneById: function(id){
        var deferred = q.defer();
        Champion.find({
            id: id
        }, function(err, summoners){
            if(err){
                logger.error(err);
                deferred.reject(err);
            } else if(summoners > 1){
                logger.warn('More than one champ exists with id: ' + id);
            }

            deferred.resolve(summoners[0]); //only return ONE
        });
        return deferred.promise;
    }
};

module.exports = {
    createOrUpdate: methods.createOrUpdate,
    getOneById: methods.getOneById
};