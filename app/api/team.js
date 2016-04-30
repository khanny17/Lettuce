'use strict';

var Team = require('../models/team');

//Maps functions to endpoints
var init = function(router){
    //These are mounted on /api/team
    router.get('/team-names', endpoints.getTeamNames);
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
        Team.create(req.body.team)
        .then(function(team){
            res.send(team);
        })
        .catch(res.status(500).send);
    }


};

module.exports = {
    init: init
};