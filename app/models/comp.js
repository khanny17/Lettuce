'use strict';
var mongoose    = require('mongoose');

var logger = require('../utilities/logger');
var q = require('q');

//Set up a mongoose model

var Comp = mongoose.model('comp', {
        name: String
});


var methods = {
    create:function(name){
        var deferred  = q.defer();      
        Comp.create({
            name: name,
        },  function(err){
            if(err){
                logger.error(err);
                deferred.reject(err);
                return;
            }
            logger.info('Created/Updated Lane: ' + name);
            deferred.resolve(name + ' updated');
        });
        return deferred.promise;            
    },
    get: function(compID){
        var deferred = q.defer();
        Comp.findOne({
            _id: compID
        }, function(err, comp){
            if(err){
                logger.error(err);
                deferred.reject(err);
            } 
            deferred.resolve(comp); //only return ONE NO
        });
        return deferred.promise;
    }
};



module.exports = {
    create: methods.create,
    get: methods.get

};