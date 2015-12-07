'use strict';
// public/js/services/RiotService.js
angular.module('RiotService', [])
.factory('Riot', ['$http', '$q', function($http, q) {

    return {
        // call to get all nerds
        getMatches : function() {
            var deferred = q.defer();
            $http.get('/api/riot/getMatchSummaries')
            .then(function(response){
                deferred.resolve(response.data);
            });
            return deferred.promise;
        }
    };       

}]);