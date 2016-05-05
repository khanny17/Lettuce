'use strict';

var ChampMastery = require('../models/champMastery');
var Summoner = require('../models/summoner');

//Maps functions to endpoints
var init = function(router){
    //These are mounted on /api/champ-mastery
    router.get('/get-by-summoner-name', endpoints.getBySummonerName);
};


//Defines endpoint logic
var endpoints = {

    //Returns names of all teams that have registered with our site
    getBySummonerName: function(req, res){
        Summoner.getOneByName(req.query.summonerName)
        .then(function(summoner){
            return ChampMastery.getByPlayerId(summoner.id);
        })
        .then(function(champMasteries){
            res.send(champMasteries);
        })
        .fail(function(e){
            res.send(e, 500);
        });
    }
    
};

module.exports = {
    init: init
};