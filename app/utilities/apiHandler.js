'use strict';
var https = require('https');
var q = require('q');
var logger = require('../utilities/logger');
var config = require('../../config/config.js');

//The last promise in the chain
var latestPromise;

//attach the new promise to be done when the last finishes
var enqueue = function(url){
    var deferred = q.defer();
    if(!latestPromise){
        //nothing in queue yet
        getJSON(url).then(deferred.resolve).fail(deferred.reject);
    } else {
        //We do have a previous promise, chain it on
        latestPromise.fin(function(){
            setTimeout(function(){
                getJSON(url).then(deferred.resolve).fail(deferred.reject);
            }, config.riot.rateLimit);
        });
    }
    latestPromise = deferred.promise;
    return deferred.promise;
};

var getJSON = function(url){
    var deferred = q.defer();
    var fullUrl;
    //if there is already a querystring, we append with &, not ?
    if(url.indexOf('?') >= 0) {
        fullUrl = url + '&api_key=' + config.riot.apiKey;
    } else {
        fullUrl = url + '?api_key=' + config.riot.apiKey;
    }

    logger.debug(fullUrl);

    //Make the request to Rito
    https.get(fullUrl, function(res){
        //String to hold our data as we get it
        var body = '';
        res.on('data', function(d){
            body += d;
        });

        res.on('error', deferred.reject);


        //The actual logic
        res.on('end', function(){
            //Take the string response and convert to JSON
            var object;
            try {
                object = JSON.parse(body);
            } catch (e){
                logger.error(e);
                deferred.reject(e);
            }
            deferred.resolve(object);
        });
    });
    return deferred.promise;
};

module.exports = enqueue;