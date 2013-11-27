var mongoose = require('mongoose');
var Ride = mongoose.model('Ride');

exports.getRide = function(req, res){
    res.render('ride',
        {
            groupId : req.params.groupId,
            rideId : req.params.rideId
        }
    );
}