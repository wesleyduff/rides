var mongoose = require('mongoose');
var User = mongoose.model('User');

/*// GET user creation form
exports.create = function (req, res) {
    res.render('user-form', {
        title: 'Create user',
        buttonText: "Join!"
    });
};

exports.index = function (req, res) {
	if(req.session.loggedIn === true){
		res.render('user-page', {
			title : req.session.user.name,
			name: req.session.user.name,
			email: req.session.user.email,
			userId: req.session.user._id
		});
	} else {
		res.render('user-page', {
			title : "Welcome User"
		});
	}
};*/

exports.getUsers = function(req, res) {
    res.json([{"status" : "error", "error" : "This needs to be implementd : get Users"}]);
};

exports.createNewUser = function(req, res){
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
};

exports.checkLoginStatus = function(req, res){
    if(req.session.loggedIn){
        res.json([{"status" : "success"}, req.session.user]);
    } else {
        res.json([{"status" : false }]);
    }
};
//This method if status === error then error is an array. This is different than the others
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


// POST new user creation form
exports.doCreate = function (req, res) {
    //console.log(req);
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        modifiedOn: req.body.modifiedOn,
        lastLogin: req.body.lastLogin
    }, function (err, user) {
        if (err) {
            console.log("error: ===== " + err);
            if (err.code === 11000) {
				res.json({"status" : "error", "error" : "Email already exists"});
            } else {
                res.json({"status" : "error", "error" : "Error adding user: " + req.body.fullName});
            }
        } else {
            // Success
            console.log("User cretated and savced: " + user);
			req.session.user = { "name" : user.name, "email": user.email, "_id": user._id };
			req.session.loggedIn = true;
			res.json(user);
        }
    });
};