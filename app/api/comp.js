'use strict';

var Filter        = require('../models/filter');
var Lane         = require('../models/lane');
var Comp       = require('../models/comp');
var q               = require('q');
var _               = require('lodash');
var logger      = require('../utilities/logger');



var init = function(router){
    router.post('/create', endpoints.createComp);
    router.get('/get', endpoints.get);
    router.get('/getTeamComps', endpoints.getTeamComps);
};


var endpoints = {
    createComp: function(req, res){
        var compID;
        Comp.create(req.body.comp.name, req.body.comp.teamname) 
        .then(function(comp){
            compID = comp._id;
            var promises = [
                Lane.create('Top', comp._id),
                Lane.create('Jungle', comp._id),
                Lane.create('Mid', comp._id),
                Lane.create('Sup', comp._id),
                Lane.create('ADC', comp._id)
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
    },
    getTeamComps: function(req, res) {
        logger.debug('/getTeamComps: ' + req.query.teamname);
        var teamComps;
        Comp.getByTeam(req.query.teamname)
        .then(function(comps){
            teamComps = comps;
            var promises = [];
            comps.forEach(function(comp){
                promises.push(Lane.getByCompID(comp._id));
            });
            return q.all(promises);
        })
        .then(function(arrayOfLanes){
            var lanes = _.flatten(arrayOfLanes);
            lanes.forEach(function(lane){
                var comp = _.find(teamComps, function(c){
                    return c._id.toString() === lane.compID.toString();
                });
                (comp.lanes || (comp.lanes = [])).push(lane);
            });
            res.status(200).send(teamComps);
        })
        .catch(function(err){
            res.status(500).send(err);
        });
    }
};


//This takes in a CompID and returns a full Comp
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
        deferred.resolve(fullComp);
    });
    return deferred.promise;
}

module.exports = {
    init: init
};