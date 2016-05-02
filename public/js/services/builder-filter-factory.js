'use strict';
angular.module('BuilderFilterFactory', [])

.factory('BuilderFilter', function(){
    var types = {
        summoner: 'summoner',
        role: 'role'
    };

    var filterOptions = {
        summoner: {
            type: 'summoner',
            placeholder: 'Summoner',
            max: 1
        },

        role: {
            type: 'role',
            placeholder: 'Role',
            max: null
        }
    };


    var BuilderFilter = function Constructor(type){
        var option = filterOptions[type];
        return JSON.parse(JSON.stringify(option));
    };

    BuilderFilter.getTypes = function(){
        return types;
    };

    BuilderFilter.getOptions = function(){
        return filterOptions;
    };


    return BuilderFilter;
});