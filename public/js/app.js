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

//Get team name from subdomain (like slack!)
.value('TeamName', {
    val: null
})
.run(['TeamName', function(TeamName){
    var domains = location.hostname.split('.');
    if(domains.length > 1){
        TeamName.val = domains[0];
    }
}]);