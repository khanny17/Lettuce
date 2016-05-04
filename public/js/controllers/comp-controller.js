'use strict';
angular.module('CompController', [])

.controller('compController', ['$scope', 'comp',
    function($scope, comp) {
        
    $scope.comp = comp;
    
}]);