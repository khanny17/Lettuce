'use strict';
var mongoose    = require('mongoose');

var logger = require('../utilities/logger');
var q = require('q');

//Set up a mongoose model

var Comp = mongoose.model('comp', {
    name: String,
    teamname: String
});


/**
*This model handles a Comp and storing that information in the database.
*When a comp is created it allows us to store it in the database and then find it 
*either by compID or teamname.
**/

var methods = {
    create: function(name, teamname){
        var deferred  = q.defer();      
        Comp.create({
            name: name,
            teamname: teamname
        }, function(err, comp){
            if(err){
                logger.error(err);
                deferred.reject(err);
                return;
            }
            logger.debug('Created comp: ' + name);
            deferred.resolve(comp.toObject());
        });
        return deferred.promise;            
    },
    get: function(compID){
        var deferred = q.defer();
        Comp.findOne({
            _id: compID
        }).lean().exec(function(err, comp){
            if(err){
                logger.error(err);
                deferred.reject(err);
            } 
            deferred.resolve(comp);
        });
        return deferred.promise;
    },
    getByTeam: function(teamname) {
        var deferred = q.defer();
        if(!teamname) {
            deferred.reject('No team name given!');
            return deferred.promise;
        }
        Comp.find({
            teamname: teamname
        }).lean().exec(function(err, comps){
            if(err){
                logger.error(err);
                deferred.reject(err);
            } 
            deferred.resolve(comps);
        });
        return deferred.promise;
    }
};



module.exports = {
    create: methods.create,
    get: methods.get,
    getByTeam: methods.getByTeam
};