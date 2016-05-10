'use strict';

var q = require('q');
var _ = require('lodash');
var User = require('../models/user');
var Summoner = require('../models/summoner');
var Stats = require('../models/stats');
var logger = require('../utilities/logger');

//Maps functions to endpoints
var init = function(router){
    //These are mounted on /api/summoner
    router.get('/get-by-team', endpoints.getByTeam);
    router.get('/get-champ-stats', endpoints.getChampStats);
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
            summoners = _.uniq(summoners, function(summoner){
                return summoner.id;
            });
            res.status(200).send(summoners);
        })
        .catch(function(error){
            res.status(500).send(error);
        });
    },

    getChampStats: function(req, res) {
        logger.debug('/get-champ-stats');
        Stats.getBySummonerId(req.query.summoner)
        .then(function(stats){
            res.status(200).send(stats);
        })
        .catch(function(error){
            res.status(500).send(error);
        });
    }


};

module.exports = {
    init: init
};