var mongoose = require('mongoose');
var Ride = mongoose.model('Ride');

exports.index = function(req, res) {
	res.render('ride-form');
}

exports.doCreate = function(req, res) {
	res.render('ride-form');
}