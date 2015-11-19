'use strict';
var gulp    = require('gulp');
var nodemon = require('gulp-nodemon');
var jshint  = require('gulp-jshint');
var sass    = require('gulp-sass');
var mocha   = require('gulp-mocha');
require('dotenv').load();


//Run mocha tests
gulp.task('mocha', function(){
    return gulp.src('./test/**/*.js', {read: false})
    .pipe(mocha({reporter: 'nyan'}));
});

//Compile Sass
gulp.task('sass', function() {
    return gulp.src('./public/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/css'));
});

//Run jshint on our javascript files
gulp.task('jshint', function(){
    return gulp.src(['./app/**/*.js', './test/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

//Run any tasks involved with building the code
gulp.task('build', ['jshint', 'sass', 'mocha']);

//Build and start server
gulp.task('default', ['build'], function(){
    nodemon({
        script: 'server.js'
    });
});
