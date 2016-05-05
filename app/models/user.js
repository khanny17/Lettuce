'use strict';
var mongoose 	= require('mongoose');
var Schema 	= mongoose.Schema;
var bcrypt 	= require('bcrypt-nodejs');
var q = require('q');
var logger = require('../utilities/logger');

//Set up a mongoose model

var UserSchema = new Schema({
	name: {
		type: String,
		unique: true,
		required: true 
	},
	password: {
		type: String,
		required: true
	}, 
	summoner: {
		type: String,
		required: true
	},
	teamname: {
		type: String,
		required: true
	}
});

UserSchema.pre('save', function (next){
	var user = this;
	if (this.isModified('password') || this.isNew) {
		bcrypt.genSalt(10, function (err, salt) {
			if (err) {
				return next(err);
			}
			bcrypt.hash(user.password, salt, null, function (err, hash) {
				if (err) {
					return next(err);
				}
				user.password = hash;
				next();
			});
		});
	}	else {
		return next();
	}
});

UserSchema.methods.comparePassword = function (passw, cb) {
	bcrypt.compare(passw, this.password, function (err, isMatch) {
		if (err) {
			return cb(err);
		}
		cb(null, isMatch);
	});
};

var User = mongoose.model('User', UserSchema);



var methods = {
	getByTeam: function(teamname){
		var deferred = q.defer();

		User.find({
			teamname: teamname
		}).lean().exec(function(err, teams){
			if(err){
				logger.error(err);
				return deferred.reject(err);
			}
            deferred.resolve(teams);
		});
		return deferred.promise;
	}
};



module.exports= {
	User: User,
	getByTeam: methods.getByTeam
};