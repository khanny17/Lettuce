'use strict';
angular.module('routes', [])

.config(['$stateProvider', '$urlRouterProvider', 
function( $stateProvider,   $urlRouterProvider) {

    $urlRouterProvider.otherwise('/'); //default state

    $stateProvider
        .state('landing', {
            url: '/',
            templateUrl: 'views/landing.html',
            controller: function(){}
        });


}]);