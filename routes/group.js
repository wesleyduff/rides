var mongoose = require('mongoose');
var Ride = mongoose.model('Group');

exports.getGroups = function(req, res) {
    res.json({"status" : "error", "error" : "This needs to be implementd : get Groups"});
};

exports.createNewGroup = function(req, res){
    res.json({"status" : "error", "error" : "This needs to be implementd : create New Group"});
};
