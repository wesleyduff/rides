app //Our module. Assigned as a global variable in scripts.js


//----------------------------------------------------------------
//----Ride
// ------
//Using $resource
//ngResource required in model
//@paramter $resource
    // -- angular-reource.js required
//--------------------------------------------------------------
.factory('rideFactoryResponse', function($resource){
    return $resource('/api/rides',
        {},
        {
            update: {method:'PUT'}
        }
    );
});