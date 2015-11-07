'use strict';
var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var jshint = require('gulp-jshint');


//Run jshint on our javascript files
gulp.task('jshint', function(){
    return gulp.src('./app/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

//Run any tasks involved with building the code
gulp.task('build', ['jshint']);

//Build and start server
gulp.task('default', ['build'], function(){
    nodemon({
        script: 'server.js'
    });
});
