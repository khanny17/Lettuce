'use strict';
angular.module('Lettuce')

.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
function( $stateProvider,   $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);

    $stateProvider
        //Base States
        .state('base', {
            abstract: true,
            templateUrl: 'views/base/base.html'
        })
        .state('base.landing', {
            url: '/',
            templateUrl: 'views/base/landing.html'
        })

        //States for Team Sites
        .state('team', {
            abstract: true,
            templateUrl: 'views/team/team.html'
        })
        .state('team.home', {
            url: '/',
            templateUrl: 'views/team/home.html'
        });

}])

.run(['$rootScope', 'TeamName', '$state', function($rootScope, teamName, $state){

    $rootScope.$on('$stateChangeStart',
        function(event, toState){
        //Check subdomain - www is invalid team name
        if(teamName.val === null || teamName.val === 'www'){
            //No team, send to generic site
            if(toState.name.split('.')[0] !== 'base'){
                event.preventDefault();
                $state.transitionTo('base.landing');
            }
        } else {
            //Has team, send to team site
            if(toState.name.split('.')[0] === 'base'){
                event.preventDefault();
                $state.transitionTo('team.home');
            }
        }
    });
}]);