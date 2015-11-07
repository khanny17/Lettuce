// server.js
'use strict';
//Load environment variables
require('dotenv').load();

// modules =================================================
var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var mongoose       = require('mongoose');

// configuration ===========================================
    
// config files
var db = require('./config/db');
var config = require('./config/config');

// set our port
var port = process.env.PORT || 8080; 
// connect to our mongoDB database 
mongoose.connect(db.url, {authMechanism: 'ScramSHA1'}); 

// get all data/stuff of the body (POST) parameters
// parse application/json 
app.use(bodyParser.json()); 
// parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 
// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override')); 
// set the static files location /public/img will be /img for users
app.use(express.static(__dirname + '/public')); 



// Set up Services

//CronJob to update our database with info from rito
var riot = require('./app/services/riot.js');
riot.init(config.riot.updateInterval);




// routes ==================================================
require('./app/routes')(app); // configure our routes

// List of api service modules and the route to mount them on
var apiServices = [
    { route: '/riot', service: require('./app/api/riot') }
];

//For each sub-api:
apiServices.forEach(function(api){
    var router = express.Router();      //Create a new Router object
    api.service.init(router);           //Initialize the endpoints
    app.use('/api' + api.route, router); //Mount sub-api
});


//Default route that sends our angular application
app.get('*', function(req, res) {
    res.sendFile('./public/views/index.html'); // load our public/index.html file
});




// start app ===============================================
// startup our app at http://localhost:8080
app.listen(port);               

// shoutout to the user                     
console.log('Server running on port ' + port);
