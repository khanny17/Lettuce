'use strict';
//Logger module (in case we ever want to do something fancy like upload somewhere)
var config = require('../../config/config.js');


var minlevel = config.logging.minlevel || 0;   //By default show everything

var levels = {
    DEBUG : {  val: 0, name: 'Debug' }, 
    INFO  : {  val: 1, name: 'Info'  },
    WARN  : {  val: 2, name: 'Warn'  },
    ERROR : {  val: 3, name: 'Error' }
};

//Controls log statements - they only output if severity greater than min set in config
var log = function(msg, level){
    //Don't show if below minimum
    if(level < minlevel){
        return;     
    }

    //If its more severe than a warning, print using console.error
    if(level < levels.WARN){
        console.log(msg);
    } else {
        console.error(msg);
    }

};


module.exports = {
    debug: function(msg) { log(levels.DEBUG.name + ': ' + msg, levels.DEBUG.val); },
    info : function(msg) { log(levels.INFO.name  + ': ' + msg, levels.INFO.val ); },
    warn : function(msg) { log(levels.WARN.name  + ': ' + msg, levels.WARN.val ); },
    error: function(msg) { log(levels.ERROR.name + ': ' + msg, levels.ERROR.val); }
};