
/**
 * Module dependencies.
 */

var express = require('express');
var db = require('./model/db');
var routes = require('./routes');
var ride = require('./routes/ride');
var user = require('./routes/user');
var api = require('./routes/api');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/* ****************************************
** CORE ROUTES
**************************************** */
// ROUTES BASIC
app.get('/', routes.index);

/* ****************************************
** API ROUTES
**************************************** */
//login
app.get('/api/checkLoginStatus', api.checkLoginStatus); //check if user is logged in
app.post('/api/login', api.doLogin); //login user
app.post('/api/logout', api.doLogOut); //Logout user TODO:// NEEDS TO BE IMPLEMENTED
//user
app.post('/api/users', api.registerUser); //Create a new user
app.get('/api/users', api.getUsers); //get a list of users from the API
//rides
app.get('/api/rides', api.getRides); //get a list of rides from the API
app.post('/api/ride/new', api.createNewRide); //Create a new Ride

/* ****************************************
** SET UP SERVER
**************************************** */
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
