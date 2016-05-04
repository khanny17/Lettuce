'use strict';
var mongoose    = require('mongoose');
var Schema  = mongoose.Schema;
var logger = require('../utilities/logger');
var q = require('q');

//Set up a mongoose model

var Filter = mongoose.model('Filter', {
        type: String,
        model: String,
        max: Number,
        laneID: Number
});


var methods = {
    create:function(type,model,max,laneID){
        var deferred  = q.defer();      
        FIlter.update({
            type: type,
            model: model,
            max: max,
            laneID: ID
        },{
            type: type,
            model: model,
            max: max,
            laneID: ID
        },{
            upsert: true //Creates if doesnt exist
        },  function(err){
            if(err){
                logger.error(err);
                deferred.reject(err);
                return;
            }
            logger.info('Created/Updated filter ' + type);
            deferred.resolve(type + ' updated');
        });
        return deffered.promise;            
    }
}


module.exports = {
    create: methods.create
};
