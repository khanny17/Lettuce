'use strict';
angular.module('OnEnterDirective', [])

//Calls a function when someone presses enter

.directive('onEnter', [function(){
    return {
        restrict: 'A',
        scope: {
            onEnter: '&',
        },
        link: function(scope, elem){
            elem.on('keyup', function(event){
                if (event.keyCode === 13) {
                    scope.onEnter();
                }
            });

        }
    };
}]);