var mongoose = require('mongoose');
var User = mongoose.model('User'); //user schema and model created in model/db.js
var Ride = mongoose.model('Ride'); //ride schema and model created in model/db.js
var Group = mongoose.model('Group'); //ride schema and model created in model/db.js


/* ****************************************
 ** USERS API CALLS
 **************************************** */
//----------------------------------------------------------------
//--- Check login
// check if user is logged in - this happens on page load
//--------------------------------------------------------------
exports.checkLoginStatus = function(req, res){
    if(req.session.loggedIn){
        res.json({"status" : true, "user" : req.session.user });
    } else {
        res.json({"status" : false });
    }
};

//----------------------------------------------------------------
//----Login User
//--------------------------------------------------------------
exports.doLogin = function(req, res){

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
                        res.json({
                                    "status" : "error",
                                    "error" : error
                                });
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

                            res.json({
                                        "status" : "error",
                                        "error" : error
                                    });
                        }
                    }
                } else {
                    error.push('An error occured. Please contact the user administrator');
                    res.json(
                            {
                                "status" : "error",
                                "error" : error
                            });
                }
            }
        );
    } else {
        error.push('Email and/or password was not provided');
        res.json({
                    "status" : "error",
                    "error" : error
                });
    };
};

//----------------------------------------------------------------
//----Logout a user
//--------------------------------------------------------------
exports.doLogOut = function(req, res){
    req.session.loggedIn = false;
    res.json({"status": "success", "success" : "Log back in"});
}


//----------------------------------------------------------------
//----Get User(s)
//----------------------------------------------------------------
exports.getUsers = function(req, res) {
    User.find({}, function(err, users){
        if(!err) {
            res.json(users);
        } else {
            res.json([{"status" : "error", "error" : err}]); //an array is expected here
        }
    });
};

exports.getUser = function(req, res){
    User.findById(req.params.id, function(err, _user){
        if(!err){
            res.json(_user);
        } else {
            res.json(err);
        }
    });
};

exports.saveUser = function(req, res){
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
            if(err){ // If error then we know the user has not been registered before\
                if (err.code === 11000) { //email has already been taken
                    res.json({"status": "error", "error": "User already exists"});
                } else { //if a general error happens then there is something wrong with the code or the host
                    res.json(err);
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
        res.json({"status" : "error", "error" : "Password and/or e-mail was not entered"});
    }
}

//----------------------------------------------------------------
//----Update a current user
//--------------------------------------------------------------
exports.updateUser = function(req, res){
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



/* **********************************
 ** RIDE API CALLS
 ********************************** */

//----------------------------------------------------------------
//----Get a list of all rides from the provided group
//--------------------------------------------------------------
exports.getRides = function(req, res) {
    console.log("param id get rides" + req.params.id);
    Group.findById(req.params.id, 'rides _id', function(err, _group){
        if(!err) {
            res.json(_group.rides);
        } else {
            res.json({"status" : "error", "error" : err});
        }
    });
};
//----------------------------------------------------------------
//----Get all the RSVPed riders for a specific ride
//--------------------------------------------------------------
exports.getRiders = function(req, res){
    Group
        .findById(req.params.groupid, 'rides')
        .populate('rides.riders', 'id name')
        .exec( function(err, _group){
            if(!err){
                var returnRidersObject = {riders : []};
                var _selectedRide = _group.rides.id(req.params.rideid);
                _selectedRide.riders.forEach(function(_riderInQuestion){ //loop through the current riders list and make sure we are not adding a duplicate. This should take place on the UI side, but here too for good measure.
                    returnRidersObject.riders.push({id : _riderInQuestion._id.toString(), name : _riderInQuestion.name});
                });
                return res.json({"status":"succcess", "result":returnRidersObject});
            } else {
                return res.json({"status":"error", "error":"Get Riders has failed"})
            }
        });

};
//---------------------------------------------------------------
//----Remove User for Ride
//---------------------------------------------------------------
exports.removeRSVPRider = function(req, res){
    if(req.body.ride && req.body.rider){
        Group
            .findById(req.body.ride.belongsToGroup, 'rides')
            .populate('rides.riders', 'id name')
            .exec( function(err, _group){
                if(!err){
                    /*
                     SCOPPED VARIABLES
                     -
                     */
                    var returnRidersObject = { riders : []}; //This object will be returned in the response json and will hold the riders name and id
                    var _selectedRide = _group.rides.id(req.body.ride._id); //select the ride we are wanted to add riders to

                    _selectedRide.riders.forEach(function(_riderInQuestion){
                        if(_riderInQuestion._id.toString() !== req.body.rider._id){
                            returnRidersObject.riders.push({id : _riderInQuestion._id.toString(), name : _riderInQuestion.name});
                        }
                    });

                    _selectedRide.riders = returnRidersObject.riders;

                    //update the riders array inside the the specific ride in our group.
                    _group.rides.id(req.body.ride._id).set('riders', _selectedRide.riders);

                    //save group
                    _group.save(function(err, _groupSaved){
                        if(!err){
                            return res.json({"status" : "success" , result : returnRidersObject});
                        } else {
                            return res.json({"status" : "error", "error": err});
                        }
                    });

                } else {
                    return res.json({"status" : "error" , "error" : err});
                }
            });
    } else {
        return res.json({"status" : "error", "error" : "Ride and Rider was not provided"});
    }
}


//----------------------------------------------------------------
//----Add User to Ride
//--------------------------------------------------------------
exports.addRider = function(req, res){
    if(req.body.ride && req.body.rider){

        //Add ride to group
        Group
            .findById(req.body.ride.belongsToGroup, 'rides')
            .populate('rides.riders', 'id name')
            .exec( function(err, _group){
                if(!err){
                    /*
                    SCOPPED VARIABLES
                    -
                     */
                    var returnRidersObject = { riders : []}; //This object will be returned in the response json and will hold the riders name and id
                    var riderFound = false; //if the rider is found then return only the array of rsvp'ed riders
                    var _selectedRide = _group.rides.id(req.body.ride._id); //select the ride we are wanted to add riders to



                    //Check to see if the logged in user is already registered for this ride.
                    _selectedRide.riders.forEach(function(_riderInQuestion){ //loop through the current riders list and make sure we are not adding a duplicate. This should take place on the UI side, but here too for good measure.
                        if(_riderInQuestion._id.toString() === req.body.rider._id){ //check id's as string and compare the two. Maybe find an equals method to compare the two
                            riderFound = true;
                        }
                        returnRidersObject.riders.push({id : _riderInQuestion._id.toString(), name : _riderInQuestion.name});
                    });

                    //if the rider is found return the json w/ error
                    if(riderFound){
                      return res.json({"status" : "error", "error" : "User has already registerd. Would you like to unregister for this ride?"})
                    }

                    //add the current user to the RSVP list
                    returnRidersObject.riders.push({id : req.body.rider._id.toString(), name: req.body.rider.name}); //we need the id to be a sting so we can use it in our views


                    //save the current logged in user to the rides riders array
                    _selectedRide.riders.push(req.body.rider._id);

                    //update the riders array inside the the specific ride in our group.
                    _group.rides.id(req.body.ride._id).set('riders', _selectedRide.riders);

                    //save group
                    _group.save(function(err, _groupSaved){
                        if(!err){
                            return res.json({"status" : "success" , result : returnRidersObject});
                        } else {
                            return res.json({"status" : "error", "error": err});
                        }
                    });
                } else {
                    return res.json({"status" : "error" , "error" : err});
                }

            });
    } else {
        return res.json({"status" : "error", "error" : "Data was not provided"});
    }
};

//----------------------------------------------------------------
//----Create a new Ride
//--------------------------------------------------------------
exports.createNewRide = function(req, res){
    console.log(req.body);
    if(req.body.title && req.body.description){
        var ride =
        {
            title: req.body.title,
            description: req.body.description,
            url: req.body.url,
            scheduledForDate: req.body.scheduledForDate,
            createdBy: req.body.userId,
            belongsToGroup: req.body.belongsToGroup
        };
        //Add ride to group
        Group.findById(req.body.belongsToGroup, 'rides _id', function(err, _group){
            if(!err){
                _group.rides.push(ride);
                _group.save(function(err, _groupSaved){
                    if(!err){
                        console.log(_groupSaved);
                        res.json(_groupSaved);
                    } else {
                        //saving the group failed
                        console.log(err);
                        return res.json({"status" : "error", "error" : err});
                    }
                });
            } else {
                res.json({"status" : "error", "error" : err });
            }
        });
    } else {
        res.json({"status" : "error", "error" : "Title or description was not provided"});
    }
};


/* **********************************
 ** GROUP API CALLS
 ********************************** */

exports.addGroup = function (req, res) {
    console.log(req.body);
    res.json({"error": "err"});
};

//----------------------------------------------------------------
//----Create a new Ride
//--------------------------------------------------------------
exports.createGroup = function(req, res){
    console.log(req);
    Group.create(
        {
            title: req.body.title,
            description: req.body.description
        }, function(err, _group){
            if(!err){
                console.log("Ride created and saved: " + _group);
                res.json(_group);
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
exports.getGroup = function(req, res){
    Group.findById(req.params.id, 'rides _id', function(err, _group){
        if(!err){
            res.json(_group);
        } else {
            res.json({"status" : "error", "error" : err});
        }
    });
};
exports.getAllGroups = function(req, res){
    Group.find({}).sort({createdOn: 1}).execFind(function(err, _groups){
        if(!err) {
            res.json(_groups);
        } else {
            res.json([{"status" : "error", "error" : err}]);
        }
    });
};

