'use strict';
angular.module('LettuceRoutes', ['CompService'])

.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
function( $stateProvider,   $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);

    $stateProvider
        //Base States
        .state('base', {
            abstract: true,
            templateUrl: 'views/base/base.html',
            controller: 'baseController'
        })
        .state('base.landing', {
            url: '/',
            templateUrl: 'views/base/landing.html'
        })
        .state('base.search', {
            url: '/search?query',
            templateUrl: 'views/base/search.html',
            controller: 'searchController'
        })
        .state('base.create', {
            url: '/create',
            templateUrl: 'views/base/create.html',
            controller: 'createController'
        })

        //Team-specific states
        .state('team', {
            abstract: true,
            templateUrl: 'views/team/team.html',
            controller: 'teamController',
            resolve: {
                team: ['teamService', 'TeamName', '$state', '$q',
                    function(teamService, teamName, $state, $q){
                        var deferred = $q.defer();

                        teamService.getTeam(teamName.val)
                        .then(deferred.resolve)
                        .catch(function(err){
                            $state.go('notfound', {error: err});
                            deferred.reject(err);
                        });
                        
                        return deferred.promise;
                }]
            }
        })
        .state('team.home', {
            url: '/',
            templateUrl: 'views/team/home.html'
        })
        .state('team.comps', {
            url: '/comps',
            templateUrl: 'views/team/comps.html',
            controller: 'compsController',
            resolve: {
                comps: ['compService', function(compService){
                    return compService.getTeamComps();
                }]
            }
        })
        .state('team.comp', {
            url: '/comp/:compID',
            templateUrl: 'views/team/comp.html',
            controller: 'compController',
            resolve: {
                comp: ['compService', '$stateParams', function(compService, $stateParams){
                    return compService.get($stateParams.compID);
                }]
            }
        })




        //This state is a special case - its the one where we dont actually have a team
        //with the subdomain that you gave us. So if someone types in 
        //http://somethingrandomblahblah.lettucelol.com
        //this is where they go
        //...
        //Unless someone actually has a league team called somethingrandomblahblah.
        //But you get the point.
        .state('notfound', { 
            url: '/notfound',
            templateUrl: 'views/team/notfound.html',
            controller: 'notfoundController'
        });

}])


//This guy handles the subdomain routing. This is where we look at the subdomain 
//and figure out if you're trying to get to the base, non-team page, or the team page
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