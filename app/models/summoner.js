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
    create: function(id, name){
        var deferred = q.defer();
        Summoner.create({
            id: id,
            name: name
        }, function(err, summoner){
            if(err){
                logger.error(err);
                deferred.reject(err);
            }
            logger.info('Created summoner: ' + summoner);
            deferred.resolve(summoner);
        });
        return deferred;
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
        return deferred;
    }
};

module.exports = {
    create: methods.create,
    getOneByName: methods.getOneByName
};