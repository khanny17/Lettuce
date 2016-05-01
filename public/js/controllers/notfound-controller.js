'use strict';
angular.module('NotfoundController', [])

.controller('notfoundController', ['$scope', 'TeamName', '$location',
    function($scope, teamName, $location){
    $scope.teamName = teamName.val;

    var subdomain = $location.host().split('.')[0];
    var protocol = $location.protocol();
    var newUrl = $location.absUrl();
    newUrl = newUrl.replace(protocol + '://', ''); //remove protocol
    newUrl = newUrl.replace(subdomain, 'www'); //replace subdomain with www
    newUrl = newUrl.replace($location.path(), ''); //remove path
    newUrl = protocol + '://' + newUrl + '/create'; //add protocol back in
    $scope.createPageLink = newUrl;
}]);