var riot = require('../../app/services/riot');
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
            .fail(function(error){

                done();
            });
        });

        it('should not run if something other than an array is given', function(done){
            riot.update.summoners(true)
            .then(function(){
                expect().fail('Promise was not rejected'); //Should reject promise
                done();
            })
            .fail(function(error){
                done();
            });
        });
    });
});