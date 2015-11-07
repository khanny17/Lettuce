//app/api/riot.js
'use strict';
var Summoner = require('../models/summoner');

//Maps functions to endpoints
var init = function(router){
    //These are mounted on /api/riot
    router.get('/getSummoners', endpoints.getSummoners);
};


//Defines endpoint logic
var endpoints = {

    //Sends all summoners in our db
    getSummoners: function(req, res){
        Summoner.getAll()
        .then(function(summoners){
            res.send(summoners);
        });
    }


};

module.exports = {
    init: init
};