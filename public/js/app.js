'use strict';

angular.module('Lettuce', [
    'ui.router',

    'BaseController', 
    


    'NerdService',
    'RiotService',
    'MatchDirectives'
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