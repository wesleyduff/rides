var mongoose = require('mongoose');
var Ride = mongoose.model('Ride');

exports.getRides = function(req, res) {
    res.json({"status" : "error", "error" : "This needs to be implementd : get Rides"});
};

exports.createNewRide = function(req, res){
    res.json({"status" : "error", "error" : "This needs to be implementd : create New Ride"});
};
