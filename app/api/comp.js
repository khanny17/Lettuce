'use strict';

var Filter      = require('../models/filter');
var Lane        = require('../models/lane');
var Comp        = require('../models/comp');
var q           = require('q');
var logger = require('../utilities/logger');



var init = function(router){
    router.post('/create', endpoints.createComp);
    router.get('/get', endpoints.get);
};


var endpoints = {
    createComp: function(req, res){
        var compID;

        Comp.create(req.body.comp.name) 
        .then(function(comp){
            compID = comp._id;
            var promises = [
                Lane.create('top', comp._id),
                Lane.create('jungle', comp._id),
                Lane.create('mid', comp._id),
                Lane.create('sup', comp._id),
                Lane.create('adc', comp._id)
            ];
            return q.all(promises);
        })
        .then(function(lanes){
            var promises = [];
            lanes.forEach(function(lane){
                promises.push(Filter.create('summoner', lane._id));
            });
            return q.all(promises);
        })
        .then(function(){
            return getFullComp(compID);
        })
        .then(function(fullComp){
            logger.debug(fullComp);
            res.status(200).send(fullComp);
        })
        .catch(function(reason){
            res.status(500).send(reason);
        });
    },
    get: function(req, res) {
        getFullComp(req.query.id)
        .then(function(comp){
            res.send(comp);
        })
        .catch(function(reason){
            res.status(500).send(reason);
        });
    }
};


//i still love you
function getFullComp(compID){
    if(!compID) {
        return q.reject('No Comp ID given');
    }

    logger.debug('Getting full comp for ' + compID);
    var fullComp, deferred = q.defer();
    Comp.get(compID)
    .then(function(comp){
        fullComp = comp;
        return Lane.getByCompID(compID);
    })
    .then(function(lanes){
        fullComp.lanes = lanes;
        var promises = [];
        fullComp.lanes.forEach(function(lane){
            lane.filters = [];
            promises.push(Filter.getByLaneID(lane._id)
            .then(function(filters){
                lane.filters.push.apply(lane.filters, filters);
                return filters;
            }));
        });
        return q.all(promises);
    })
    .then(function(){
        console.log(fullComp.lanes[0]);
        deferred.resolve(fullComp);
    });
    return deferred.promise;
}

module.exports = {
    init: init
};