'use strict';

var Filter     = require('../models/filter');
var Lane      = require('../models/lane');
var Comp    = require('../models/comp');
var q           = require('q');



var init = function(router){
    router.get('/create', endpoints.createComp);
};


var endpoints = {
    createComp: function(req, res){
        var compID;
        Comp.create(req.body.comp) 
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
            res.send(fullComp);
        })
        .catch(res.status(500));
    }
};


//i still love you
function getFullComp(compID){
    var fullComp ;
    return Comp.get(compID)
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
            .then(function(filter){
                lane.filters.push(filter);
                return filter;
            }));
        });
        return q.all(promises);
    })
    .then(function(){
        return fullComp;
    });
}

module.exports = {
    init: init
};