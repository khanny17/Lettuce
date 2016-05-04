'use strict';
var mongoose    = require('mongoose');
var Schema  = mongoose.Schema;
var logger = require('../utilities/logger');
var q = require('q');

//Set up a mongoose model

var Comp = mongoose.model('comp', {
        name: String
});


var methods = {
    create:function(name){
        var deferred  = q.defer();      
        Comp.update({
            name: name
        },{
            name: name,
        },{
            upsert: true //Creates if doesnt exist
        },  function(err){
            if(err){
                logger.error(err);
                deferred.reject(err);
                return;
            }
            logger.info('Created/Updated Lane: ' + name);
            deferred.resolve(name + ' updated');
        });
        return deffered.promise;            
    }
}


module.exports = {
    create: methods.create
};