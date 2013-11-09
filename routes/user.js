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
    res.json([{"status" : "error", "error" : "This needs to be implementd : create New User"}]);
};

exports.checkLoginStatus = function(req, res){
    if(req.session.loggedIn){
        res.json([{"status" : "success"}, req.session.user]);
    } else {
        res.json([{"status" : false }]);
    }
};

exports.doLogin = function(req, res){
    res.json([{"status" : "error", "error" : "This needs to be implemented : do login"}]);
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