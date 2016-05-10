'use strict';

var q               = require('q');
var _               = require('lodash');
var Team       = require('../models/team');
var User         = require('../models/user');
var logger      = require('../utilities/logger');

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
        Team.create(req.body)
        .then(function(team){
            res.status(200).send(team);
        })
        .catch(res.status(500).send);
    },

    find: function(req, res){
        logger.debug('/find: ' + req.query.name);
        var foundTeams;
        Team.findByName(req.query.name)
        .then(function(teams){
            var promises = [];
            foundTeams = teams;
            foundTeams.forEach(function(team){
                promises.push(User.getByTeam(team.nameLower));
            });
            return q.all(promises);
        })
        .then(function(arrayofUsers){
            var users = _.flatten(arrayofUsers);
            users.forEach(function(user){
                var team = _.find(foundTeams, function(team){
                    return team.nameLower === user.teamname;
                });
                (team.users || (team.users = [])).push(user);
            });
            res.status(200).send(foundTeams);
        })
        .catch(res.status(500).send);
    },


    get: function(req, res){
        var name = req.query.name.split('-').join(' ');
        console.log(name);
        Team.get(name)
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