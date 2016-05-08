'use strict';
var mongoose    = require('mongoose');

var logger = require('../utilities/logger');
var q = require('q');

//Set up a mongoose model

var Filter = mongoose.model('Filter', {
    type: String,
    model: String,
    max: Number,
    laneID: String
});

var types = {
    summoner: {
        max: 1
    },
    role: {
        max: 5
    },
    ban: {
        max: null
    }
};

var methods = {
    create:function(type, laneID){
        var deferred  = q.defer();      
        Filter.create( {
            type: type,
            model: null,
            max: types[type].max,
            laneID: laneID
        }, function(err, filter){
            if(err){
                logger.error(err);
                deferred.reject(err);
                return;
            }
            logger.debug('Created filter');
            deferred.resolve(filter.toObject());
        });
        return deferred.promise;            
    },
    get: function(filterID){
        var deferred = q.defer();
        Filter.findOne({
            _id: filterID
        }).lean().exec(function(err, filter){
            if(err){
                logger.error(err);
                deferred.reject(err);
            } 
            deferred.resolve(filter);
        });
        return deferred.promise;
    },
    getByLaneID: function(laneID){
        var deferred = q.defer();
        Filter.find({
            laneID: laneID
        }).lean().exec(function(err, filters){
            if(err){
                logger.error(err);
                deferred.reject(err);
            } 
            deferred.resolve(filters); 
        });
        return deferred.promise;
    },
    updateModel: function(id, model) {
        var deferred = q.defer();
        //Params: query, object, options, callback
        Filter.update({
            _id: id
        }, {
            model: model
        }, function(err){
            if(err){
                logger.error(err);
                deferred.reject(err);
                return;
            }
            logger.debug('Updated Filter: ' + id);
            deferred.resolve();
        });
        return deferred.promise;
    },
    delete: function(id) {
        var deferred = q.defer();

        Filter.find({
            _id: id
        })
        .remove(function(err){
            if(err){
                logger.error(err);
                deferred.reject(err);
                return;
            }
            logger.debug('Deleted Filter: ' + id);
            deferred.resolve();
        });

        return deferred.promise;
    }
};


module.exports = {
    create: methods.create,
    get: methods.get,
    getByLaneID: methods.getByLaneID,
    updateModel: methods.updateModel,
    delete: methods.delete
};
