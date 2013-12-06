
/**
 * Module dependencies.
 */

var express = require('express');
var db = require('./model/db');
var routes = require('./routes');
var ride = require('./routes/ride');
var user = require('./routes/user');
var group = require('./routes/group');
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
app.get('/api/logout', api.doLogOut); //Logout user TODO:// NEEDS TO BE IMPLEMENTED
//users
app.post('/api/users', api.saveUser); //Create a new user
app.get('/api/users', api.getUsers); //get a list of users from the API
app.put('/api/users', api.updateUser);
app.delete('/api/users', api.deleteUser); //delete a user. Deleting a list of users will come later
//user
app.get('/api/user/:id', api.getUser);
app.post('/api/user', api.saveUser);
//rides
app.get('/api/rides/:id', api.getRides);
app.post('/api/rides', api.createNewRide); //Create a new Ride
//groups
app.get('/api/group/:id', api.getGroup);
app.get('/api/groups', api.getAllGroups);
app.post('/api/groups', api.createGroup);

/* ****************************************
 ** RIDE ROUTES
 **************************************** */
app.get('/ride/:groupId/:rideId', ride.getRide); //display the page for the ride

/* ****************************************
 ** SET UP SERVER
 **************************************** */
http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});