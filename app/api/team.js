'use strict';

var Team = require('../models/team');

//Maps functions to endpoints
var init = function(router){
    //These are mounted on /api/team
    router.get('/team-names', endpoints.getTeamNames);
    router.get('/find', endpoints.find);
    router.get('/get', endpoints.get);
    router.post('/create', endpoints.createTeam);
};


//Defines endpoint logic
var endpoints = {

    //Returns names of all teams that have registered with our site
    getTeamNames: function(req, res){
        Team.getAllTeamNames()
        .then(function(names){
            res.send(names);
        })
        .fail(function(e){
            res.send(e, 500);
        });
    },

    createTeam: function(req, res){
        //TODO: Authenticate this shit!
        Team.create(req.body)
        .then(function(team){
            res.status(200).send(team);
        })
        .catch(res.status(500).send);
    },

    find: function(req, res){
        Team.findByName(req.query.name)
        .then(function(teams){
            res.status(200).send(teams);
        })
        .catch(res.status(500).send);
    },

    get: function(req, res){
        Team.get(req.query.name)
        .then(function(team){
            res.status(200).send(team);
        })
        .catch(function(error){
            res.status(500).send(error);
        });
    }


};

module.exports = {
    init: init
};