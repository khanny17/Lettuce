'use strict';

var q = require('q');
var User = require('../models/user');
var Summoner = require('../models/summoner');
var logger = require('../utilities/logger');

//Maps functions to endpoints
var init = function(router){
    //These are mounted on /api/summoner
    router.get('/get-by-team', endpoints.getByTeam);
};


//Defines endpoint logic
var endpoints = {

    getByTeam: function(req, res){
        logger.debug('/get-by-team');
        User.getByTeam(req.query.teamname)
        .then(function(users){
            var promises = [];
            users.forEach(function(user){
                promises.push(Summoner.getOneByName(user.summoner));
            });
            return q.all(promises);
        })
        .then(function(summoners){
            res.status(200).send(summoners);
        })
        .catch(function(error){
            res.status(500).send(error);
        });
    }


};

module.exports = {
    init: init
};