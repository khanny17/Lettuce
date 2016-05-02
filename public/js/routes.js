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

        //States for Team Sites
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
        .state('notfound', {
            url: '/notfound',
            templateUrl: 'views/team/notfound.html',
            controller: 'notfoundController'
        })
        .state('team.home', {
            url: '/',
            templateUrl: 'views/team/home.html'
        })
        .state('team.builder', {
            url: '/builder',
            templateUrl: 'views/team/builder.html',
            controller: 'builderController'
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