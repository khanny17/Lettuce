'use strict';
angular.module('CompService', [])

//Handles comp data

.service('compService', ['$http', function($http){
    this.create = function(comp) {
        return $http.post('api/comp/create', { comp: comp });
    };
}]);