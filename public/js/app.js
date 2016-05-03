'use strict';

angular.module('Lettuce', [
    'ui.router',
    'ui.bootstrap',

    'BaseController', 
    'SearchController', 
    'CreateController', 
    'TeamController', 
    'NotfoundController', 
    'NavbarController', 
    'BuilderController', 

    'OnEnterDirective',
    'TeamSearchResultDirective',
    'BuilderColumn',
    'Inputs'
])
.constant('AUTH_EVENTS', {
    notAuthenticated: 'auth-not-authenticated'
})
//Get team name from subdomain (like slack!)
//Now any module can get the teamname through injection
.value('TeamName', {
    val: null //OI! dont forget its TeamName.val, not TeamName. That gets me all the time
})
.run(['TeamName', function(TeamName){
    var domains = location.hostname.split('.');
    if(domains.length > 1){
        TeamName.val = domains[0];
    }
}]);