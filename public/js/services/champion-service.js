'use strict';
angular.module('ChampionService', [])

//Handles champion data

.service('championService', ['$http', function($http){
    var champions; //local copy of the list of champions

    //This function gets the champion data once
    //If you call it again without refreshing the page, it will not query the server,
    //it will just give you the list. After all, it already has the list,
    //why bother hitting the server again?
    this.getChampions = function(callback) {
        if(!champions) {
            return $http.get('/api/riot/getChampions')
            .then(function(response){
                champions = response.data;
                return callback(champions);
            });
        }

        return callback(champions);
    };
}]);