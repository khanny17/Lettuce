'use strict';
angular.module('BuilderFilterFactory', [])

//This is a module that defines a "BuilderFilter" object
//Yes, OO in javascript O: (<-thats an emoji)

//Anyways, this defines the different types of filters that we can have on the
//comp builder page. 

//TODO this should be linked to the backend eventually
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

    //When you call new BuilderFilter(),
    //this gets called
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