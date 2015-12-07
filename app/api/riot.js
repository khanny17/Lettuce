//app/api/riot.js
'use strict';
var Summoner = require('../models/summoner');
var teamMatch = require('../models/teamMatch');

//Maps functions to endpoints
var init = function(router){
    //These are mounted on /api/riot
    router.get('/getSummoners', endpoints.getSummoners);
    router.get('/getMatchSummaries', endpoints.getMatchSummaries);
};


//Defines endpoint logic
var endpoints = {


    //Gets our match summaries and sends them to the frontend
    getMatchSummaries: function(req, res){
        teamMatch.getAll()
        .then(function(matches){
            res.send(matches);
        })
        .fail(function(e){
            res.send(e,500);
        });
    },

    //Sends all summoners in our db
    getSummoners: function(req, res){
        Summoner.getAll()
        .then(function(summoners){
            res.send(summoners);
        })
        .fail(function(e){
            res.send(e,500);
        });
    }


};

module.exports = {
    init: init
};