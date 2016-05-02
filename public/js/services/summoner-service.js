'use strict';
angular.module('SummonerService', [])

//This module handles server calls for summoner data

.service('summonerService', [function(){
    
    //Eventually this function will give you the mastery level 
    //that a summoner has with a champion
    this.getMastery = function getMastery(/*summonerUsername, champion*/){
        return 1; //TODO
    };
}]);