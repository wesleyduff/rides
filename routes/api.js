var mongoose = require('mongoose');
var User = mongoose.model('User'); //user schema and model created in model/db.js
var Ride = mongoose.model('Ride'); //ride schema and model created in model/db.js


/* ****************************************
** USERS API CALLS
**************************************** */
//----------------------------------------------------------------
//--- Check login
// check if user is logged in - this happens on page load
//--------------------------------------------------------------
exports.checkLoginStatus = function(req, res){
    if(req.session.loggedIn){
        res.json([{"status" : "success"}, req.session.user]);
    } else {
        res.json([{"status" : false }]);
    }
};

//----------------------------------------------------------------
//----Login User
//--------------------------------------------------------------
exports.doLogin = function(req, res){
    var error = [];
    error.push('This needs to be implemented : do login'); //init setup
    res.json([{"status" : "error", "error" : error}]);
    //check to see if an email was provided
      //if email is not valid then update the 
    //if email is valid check password
      //if password was not provided then return error
    //if those two senarious pass then
        //need to saerch all the users for the email that was applied. Emails should be unique according to the schema.
        //if found return user
        //if not found return error
}

//----------------------------------------------------------------
//----Logout User
// look at how a user gets registered on how to perform logout tasks
// use : req.session object
//--------------------------------------------------------------
exports.doLogOut = function(req, res){
	//use the req.session.user to set the loggedin to false
	res.json(["status" : "error", "error" : "This needs to be implemented : log out user"}]);
}

//----------------------------------------------------------------
//----Get All Users
//----------------------------------------------------------------
exports.getUsers = function(req, res) {
    res.json([{"status" : "error", "error" : "This needs to be implementd : get Users"}]);
};


//----------------------------------------------------------------
//----Register a new user
//--------------------------------------------------------------
exports.registerUser = function(req, res){
	//check if email and password was provided
	if(req.body.email && req.body.password){
		//Create User and Save to DB
		 User.create({
	        name: req.body.name,
	        email: req.body.email,
	        password: req.body.password,
	        modifiedOn: req.body.modifiedOn,
	        lastLogin: req.body.lastLogin
	    }, function (err, user){
	        if(err){ // If error then we know the user has not been registered before
	            console.log("error : ==== " + err);
	            if (err.code === 11000) { //email has already been taken
	                res.json(
	                    [
	                        {
	                            "status" : "error",
	                            "error" : "User already exists."
	                        }
	                    ]
	                )
	            } else { //if a general error happens then there is something wrong with the code or the host
	                res.json(
	                    [
	                        {
	                            "status" : "error", 
	                            "error" : "Error adding user: " + req.body.fullName
	                        }
	                    ]
	                );
	            }
	        } else {
	            //success - add the new user to the DB
	            console.log("User cretated and savced: " + user);
	            req.session.user = { // store the user to the session so when the user returns they do not have to log in agaain
	                "name" : user.name, 
	                "email": user.email, 
	                "_id": user._id 
	            };
	            req.session.loggedIn = true; //set login to true. When they log out we set this to false.
	            res.json(user); //return the logged in user data
	        }
	    });
	} else { //they did not provide an email or a password. Send the error the the UI and display
		res.json([
			{"status" : "error", "error" : "Password and/or e-mail was not entered"}
		]);
	}
}




/* **********************************
** RIDE API CALLS
********************************** */

//----------------------------------------------------------------
//----Get a list of all rides
//--------------------------------------------------------------
exports.getRides = function(req, res) {
	console.log(req.session)
    res.json({"status" : "error", "error" : "This needs to be implementd : get Rides"});
};

//----------------------------------------------------------------
//----Create a new Ride
//--------------------------------------------------------------
exports.createNewRide = function(req, res){
    res.json({"status" : "error", "error" : "This needs to be implementd : create New Ride"});
};