'use strict';
angular.module('BuilderColumnFilter', ['SocketFactory'])

.directive('builderColumnFilter', ['socket', function(socket){
    return {
        replace: true,
        restrict: 'E',
        scope: {
            filter: '=',
            placeholder: '=',
            deleteFilter: '&',
            readOnly: '='
        },
        templateUrl: 'js/directives/builder-column-filter/builder-column-filter.html',
        link: function(scope) {
            var valueWeJustReceived = null; //protects from infinite loop
            socket.on('filter:updated:'+scope.filter._id, function(filterData){
                valueWeJustReceived = filterData.model;
                scope.filter.model = filterData.model;
            });

            scope.$watch('filter.model', function(newValue){
                if(newValue !== valueWeJustReceived){
                    socket.emit('filter:updated', {
                        _id: scope.filter._id,
                        model: scope.filter.model
                    });
                } else {
                    valueWeJustReceived = null;
                }
            });

            scope.delete = scope.deleteFilter();
        }
    };
}]);