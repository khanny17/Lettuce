'use strict';

var User  		= require('../models/user');
var config		= require('../../config/config');
var jwt 		= require('jwt-simple');	

var init = function(router){
    //These are mounted on /api/auth
    router.post('/signup', endpoints.signup);
    router.post('/authenticate', endpoints.authenticate);
};
var endpoints = {
	signup: function(req, res) {
		if (!req.body.name || !req.body.password) {
			res.json({success: false, msg: 'Please pass name and password.'});
		} else {
			var newUser = new User({
				name: req.body.name,
				password: req.body.password
			});
    // save the user
		    newUser.save(function(err) {
		    	if (err) {
		    		return res.json({success: false, msg: 'Username already exists.'});
		    	}
		    	res.json({success: true, msg: 'Successful created new user.'});
		    });
		}
	},
	authenticate: function(req, res) {
		User.findOne({
			name: req.body.name
		}, function(err, user) {
			if (err) {
				throw err;
			}
			if (!user) {
				res.send({success: false, msg: 'Authentication failed. User not found.'});
			} else {
      			// check if password matches
      			user.comparePassword(req.body.password, 
      				function (err, isMatch) {
		      		if (isMatch && !err) {
				        // if user is found and password is right create a token
				        var token = jwt.encode(user, config.db.secret);
				        // return the information including token as JSON
				        res.json({success: true, token: 'JWT ' + token});
		      		} else {
		      			res.send({success: false, 
		      				msg: 'Authentication failed. Wrong password.'});
		      		}
  				});
  			}
		});
	}
};


module.exports = {
    init: init
};