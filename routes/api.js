var mongoose = require('mongoose');
var User = mongoose.model('User');


/* ****************************************
** USERS API CALLS
**************************************** */
exports.registerUser = function(req, res){
	//check if email and password was provided
	if(req.body.email && req.body.password){
		 User.create({
	        name: req.body.name,
	        email: req.body.email,
	        password: req.body.password,
	        modifiedOn: req.body.modifiedOn,
	        lastLogin: req.body.lastLogin
	    }, function (err, user){
	        if(err){
	            console.log("error : ==== " + err);
	            if (err.code === 11000) {
	                res.json(
	                    [
	                        {
	                            "status" : "error",
	                            "error" : "User already exists."
	                        }
	                    ]
	                )
	            } else {
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
	            //success
	            console.log("User cretated and savced: " + user);
	            req.session.user = { 
	                "name" : user.name, 
	                "email": user.email, 
	                "_id": user._id 
	            };
	            req.session.loggedIn = true;
	            res.json(user);
	        }
	    });
	} else {
		res.json([
			{"status" : "error", "error" : "Password and/or e-mail was not entered"}
		]);
	}
}