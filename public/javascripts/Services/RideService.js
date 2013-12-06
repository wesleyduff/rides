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
    return $resource('http://localhost\\:3000/api/rides',
        {},
        {
            update: {method:'PUT'}
        }
    );
});