
/**
 * Module dependencies.
 */

var express = require('express');
var db = require('./model/db');
var routes = require('./routes');
var ride = require('./routes/ride');
var user = require('./routes/user');
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

// ROUTES BASIC
app.get('/', routes.index);

//Log In - Out Routes
app.get('/checkLoginStatus', user.checkLoginStatus); //check if user is logged in
app.post('/login', user.doLogin); //login user

//USER ROUTES
app.get('/users', user.getUsers); //get a list of users from the API
app.post('/user/new', user.createNewUser); //Create a new user

// RIDES ROUTES
app.get('/rides', ride.getRides); //get a list of rides from the API
app.post('/ride/new', ride.createNewRide); //Create a new Ride

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
