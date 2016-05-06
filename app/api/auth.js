'use strict';

var User        = require('../models/user');
var UserModel   = User.User;
var Summoner        = require('../models/summoner');
var config      = require('../../config/config');
var jwt         = require('jwt-simple');    
var logger      = require('../utilities/logger');
var apiCall = require('../utilities/apiHandler.js');

var init = function(router){
    //These are mounted on /api/auth
    router.post('/signup', endpoints.signup);
    router.post('/authenticate', endpoints.authenticate);
};
var endpoints = {
    signup: function(req, res) {
        if (!req.body.name || !req.body.password) {
            return res.json({success: false, msg: 'Please pass name and password.'});
        }

        User.create({
            name: req.body.name,
            summoner: req.body.summoner,
            teamname: req.body.teamname,
            password: req.body.password
        })
        .then(function(){
            //Now that we created a user, we need to create a summoner
            var base = config.riot.endpointUrls.summoner;
            var url = base + req.body.name;
            return apiCall(url);
        })
        .then(function(summonerData){
            console.log(summonerData);
            return Summoner.create(
                summonerData[req.body.name].id,
                summonerData[req.body.name].name 
            );
        })
        .then(function(){
            res.json({success: true, msg: 'Successfully created user'});
        })
        .fail(function(msg){
            return res.json({success: false, msg: msg});
        });
        
    },
    authenticate: function(req, res) {
        logger.debug('Attempting to authenticate ' + req.body.name +
            ' on team ' + req.body.teamname);
        UserModel.findOne({
            name: req.body.name,
            teamname: req.body.teamname
        }, function(err, user) {
            if (err) {
                throw err;
            }
            if (!user) {
                var msg = 'Authentication failed. User not found.';
                res.send({success: false, msg: msg});
                logger.debug(msg);
            } else {
                // check if password matches
                user.comparePassword(req.body.password, 
                    function (err, isMatch) {
                        if (isMatch && !err) {
                        // if user is found and password is right create a token
                        var token = jwt.encode(user, config.db.secret);
                        // return the information including token as JSON
                        res.json({success: true, token: 'JWT ' + token});
                        logger.debug(req.body.name + ' authenticated');
                    } else {
                        var msg = 'Authentication failed. Wrong password.';
                        logger.debug(msg);
                        res.send({success: false, msg: msg});
                    }
                });
            }
        });
    }
};


module.exports = {
    init: init
};