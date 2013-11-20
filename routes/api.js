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

    console.log(req.body.email);
    var error = [];
    //check to see if an email was provided
    if(req.body.email && req.body.password){
        //check database for email then compare its passwords
        User.findOne(
            {'email' : req.body.email},
            'name email _id password', //get all items
            function(err, user) {
                console.log('error ' + err);
                console.log('user L ' + user);
                if(!err){
                    if(!user){
                        error.push('The username with the password you provided did not return a valid user');
                        res.json(
                            [
                                {
                                    "status" : "error",
                                    "error" : error
                                }
                            ]);
                    } else {
                        if(user.password === req.body.password){ //Match
                            req.session.user = { // store the user to the session so when the user returns they do not have to log in agaain
                                "name" : user.name,
                                "email": user.email,
                                "_id": user._id
                            };
                            req.session.loggedIn = true; //set login to true. When they log out we set this to false.
                            res.json(user); //return the logged in user data
                        } else {
                            error.push('The password does not match the username provided')

                            res.json(
                                [
                                    {
                                        "status" : "error",
                                        "error" : error
                                    }
                                ]);
                        }
                    }
                } else {
                    error.push('An error occured. Please contact the user administrator');
                    res.json(
                        [
                            {
                                "status" : "error",
                                "error" : error
                            }
                        ]);
                }
            }
        );
    } else {
        error.push('Email and/or password was not provided');
        res.json(
            [
                {
                    "status" : "error",
                    "error" : error
                }
            ]);
    };
};

//----------------------------------------------------------------
//----Logout User
// look at how a user gets registered on how to perform logout tasks
// use : req.session object
//--------------------------------------------------------------
exports.doLogOut = function(req, res){
    //use the req.session.user to set the loggedin to false
    res.json([{"status" : "error", "error" : "This needs to be implemented : log out user"}]);
}

//----------------------------------------------------------------
//----Get All Users
//----------------------------------------------------------------
exports.getUsers = function(req, res) {
    User.find({}, function(err, users){
        if(!err) {
            console.log("users returned : " + users);
            res.json(users);
        } else {
            res.json([{"status" : "error", "error" : "The request to find all users failed"}]);
        }
    });
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

//----------------------------------------------------------------
//----Update a current user
//--------------------------------------------------------------
exports.updateUser = function(req, res){
    console.log('req : ' + req.body.password);
    User.findOne({_id: req.body._id}, function(err, _user){
        if(!err){
            console.log('updating user : ' + _user);
            if(req.body.isUpdatingUserCreds){ //if we are updating the users profile.
                _user.modifiedOn = Date.now();
                _user.name = req.body.name;
                _user.email = req.body.email;
                if(req.body.password !== undefined){
                    _user.password = req.body.password;
                }
            }
            _user.lastLogin = Date.now(); //if we are just updating the last loged in time.

            _user.save(function(err, _savedUser){
                if(!err){
                    console.log("saved user: " + _savedUser);
                    res.json(_savedUser);
                } else {
                    console.log("could not saved user: " + err);
                    res.json(
                        {"error" : "Could not save user"}
                    );
                }

            });

        } else {
            console.log('error finding one')
            res.json([
                {"error" : "Could not find user"}
            ]);
        }
    });
}

//----------------------------------------------------------------
//----Delete a user
//--------------------------------------------------------------
exports.deleteUser = function(req, res){
    res.json({"error" : "this is not yet implemented"});
};

//----------------------------------------------------------------
//----Logout a user
//--------------------------------------------------------------
exports.doLogOut = function(req, res){
    req.session.loggedIn = false;
    res.json({"status": "success", "success" : "Log back in"});
}

/* **********************************
 ** RIDE API CALLS
 ********************************** */

//----------------------------------------------------------------
//----Get a list of all rides
//--------------------------------------------------------------
exports.getRides = function(req, res) {
    Ride.find({}, function(err, _rides){
        if(!err) {
            res.json(_rides);
        } else {
            res.json([{"status" : "error", "error" : "The request to find all users failed"}]);
        }
    });
};

//----------------------------------------------------------------
//----Create a new Ride
//--------------------------------------------------------------
exports.createNewRide = function(req, res){
    console.log(req.body.belongsToGroup)
    Ride.create(
        {
            title: req.body.title,
            description: req.body.description,
            url: req.body.url,
            scheduledForDate: req.body.scheduledForDate,
            createdBy: req.body.userId,
            belongsToGroup: req.body.cat
        }, function(err, _ride){
            if(!err){
                console.log("Ride created and saved: " + _ride);
                res.json(_ride);
            } else {
                res.json(
                        {
                            "status" : "error",
                            "error" : err
                        }
                );
            }
        }
    )
};