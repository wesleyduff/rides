// Bring Mongoose into the project
var mongoose = require( 'mongoose' );

//Here we find an appropriate database to connect to, defaulting to localhst if we don't find one.
var uristring = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/MongoosePM'

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, function (err, res) {
  if (err) { 
  console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
  console.log ('Succeeded connected to: ' + uristring);
  }
});

/* ********************************************
      HANDLE EVENTS
   ******************************************** */
mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + uristring);
});

mongoose.connection.on('error',function (err) {
  console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
});

process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected through app termination');
    process.exit(0);
  });
});
/* ********************************************
 USER SCHEMA
 ******************************************** */
var userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, unique:true, required: true},
    password: {type: String},
    createdOn: { type: Date, default: Date.now },
    modifiedOn: Date,
    lastLogin: Date,
    cat: Number
});

// Build the User model
mongoose.model( 'User', userSchema );

/* ********************************************
 Ride SCHEMA
 ******************************************** */
var rideSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    url: String,
    createdOn: { type: Date, default: Date.now },
    scheduledForDate: {type : Date},
    belongsToGroup :  {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required : true
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    riders : [{
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]


});

// Build the User model
mongoose.model( 'Ride', rideSchema );

/* ********************************************
 Group SCHEMA
 ******************************************** */
var groupSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    createdOn: { type: Date, default: Date.now },
    rides : [rideSchema]

});

// Build the User model
mongoose.model( 'Group', groupSchema );

/* ********************************************
 ridersComment SCHEMA
 ******************************************** */
var ridersCommentSchema = new mongoose.Schema({
    Comment: {
        type: String,
        required: true
    },
    rider: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    ride: {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'Ride'
    }

});

// Build the User model
mongoose.model( 'RidersComment', ridersCommentSchema );