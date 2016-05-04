'use strict';
var mongoose    = require('mongoose');

var logger = require('../utilities/logger');
var q = require('q');

//Set up a mongoose model

var Filter = mongoose.model('Filter', {
        type: String,
        model: String,
        max: Number,
        laneID: Number
});
var types = {
    summoner: {
        max: 1
    },
    role: {
        max: 5
    }
};

var methods = {
    create:function(type,laneID){
        var deferred  = q.defer();      
        Filter.create( {
            type: type,
            model: null,
            max: types[type].max,
            laneID: laneID
        },  function(err){
            if(err){
                logger.error(err);
                deferred.reject(err);
                return;
            }
            logger.info('Created/Updated filter ' + type);
            deferred.resolve(type + ' updated');
        });
        return deferred.promise;            
    },
    get: function(filterID){
        var deferred = q.defer();
        Filter.findOne({
            _id: filterID
        }, function(err, filter){
            if(err){
                logger.error(err);
                deferred.reject(err);
            } 
            deferred.resolve(filter); //only return ONE NO
        });
        return deferred.promise;
    },
    getByLaneID: function(laneID){
        var deferred = q.defer();
        Filter.find({
            laneID: laneID
        }, function(err, lanes){
            if(err){
                logger.error(err);
                deferred.reject(err);
            } 
            deferred.resolve(lanes); 
        });
        return deferred.promise;
    }
};


module.exports = {
    create: methods.create,
    get: methods.get,
    getByLaneID: methods.getByLaneID
};
