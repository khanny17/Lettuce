'use strict';


var mongoose = require('mongoose');
var logger = require('../utilities/logger');
var q = require('q');
var Version = mongoose.model('Version', {
    name: String, //eg "champion"
    value: String //eg "3.5.26"
});


var methods = {
    //Creates version or updates if already exists
    saveVersionNumber: function(name, value){
        var deferred = q.defer();
        //Params: query, object, options, callback
        Version.update({
            name: name
        }, {
            name: name,
            value: value
        } ,{
            upsert: true //Create if it doesn't exist
        }, function(err){
            if(err){
                logger.error(err);
                deferred.reject(err);
                return;
            }
            logger.info(name + 'data is now at version ' + value);
            deferred.resolve();
        });
        return deferred.promise;
    },

    /*
     * Attempts to get the version number for the given data name
     * Returns: Promise, which is rejected if an error occurs,
     *          resolved with the version string if it is found successfully,
     *          or resolved with null if there is no version stored
     */
    getVersionNumber: function(name){
        var deferred = q.defer();
        Version.find({
            name: name
        }, function(err, versions){
            if(err){
                logger.error(err);
                deferred.reject(err);
            } else if(versions > 1){
                logger.warn('More than one version exists with name: ' + name);
            }

            if(versions[0]){
                deferred.resolve(versions[0].value); //only return ONE
            } else {
                //yes, we are still going to resolve if we didnt find it
                deferred.resolve(null); 
            }
        });
        return deferred.promise;
    }
};

module.exports = {
    saveVersionNumber: methods.saveVersionNumber,
    getVersionNumber: methods.getVersionNumber
};