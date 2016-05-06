'use strict';
angular.module('ChampionService', ['Configuration'])

//Handles champion data

.service('championService', ['$http', 'Config', function($http, Config){
    var champions; //local copy of the list of champions

    //This function gets the champion data once
    //If you call it again without refreshing the page, it will not query the server,
    //it will just give you the list. After all, it already has the list,
    //why bother hitting the server again?
    //IF you call it really fast, it will hit the server again.
    //long term, a better, more generic solution for all of these
    //one time service calls is needed.
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

    this.getChampionImageUrl = function(champion) {
        return Config.championImageUrlBase + champion.image.full;
    };
}]);