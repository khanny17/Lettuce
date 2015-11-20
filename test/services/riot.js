'use strict';
var proxyquire = require('proxyquire');
var loggerStub = {
    error: function(){},
    warn: function(){},
    info: function(){},
    debug: function(){}
};
//TODO make it so we stub conditionally!
//Proxyquire is used here to stub the logging 
//  module so random crap doesnt clutter the build info
var riot = proxyquire('../../app/services/riot',
                     {'../utilities/logger': loggerStub});

var chai = require('chai');
var expect = chai.expect;

describe('Riot service', function(){
    describe('summoner update method', function(){
        it('should not run if nothing given', function(done){
            riot.update.summoners()
            .then(function(){
                expect().fail('Promise was not rejected'); //Should reject promise
                done();
            })
            .fail(function(){
                done();
            });
        });

        it('should not run if something other than an array is given', function(done){
            riot.update.summoners(true)
            .then(function(){
                expect().fail('Promise was not rejected'); //Should reject promise
                done();
            })
            .fail(function(){
                done();
            });
        });
        //Next up is to build some actual tests with a mocking
        // library or maybe the real endpoints? not sure which in this case.
    });
});