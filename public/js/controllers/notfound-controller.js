'use strict';
angular.module('NotfoundController', [])

.controller('notfoundController', ['$scope', 'TeamName', '$location',
    function($scope, teamName, $location){
    $scope.teamName = teamName.val;

    //This clusterfuck is making a link to the create page
    //Yes, its because of the subdomain thing we are doing,
    //and yes, I still think the subdomain is cool enough to
    //be worth this trouble.
    var subdomain = $location.host().split('.')[0];
    var protocol = $location.protocol();
    var newUrl = $location.absUrl();
    newUrl = newUrl.replace(protocol + '://', ''); //remove protocol
    newUrl = newUrl.replace(subdomain, 'www'); //replace subdomain with www
    newUrl = newUrl.replace($location.path(), ''); //remove path
    newUrl = protocol + '://' + newUrl + '/create'; //add protocol back in
    $scope.createPageLink = newUrl;
}]);