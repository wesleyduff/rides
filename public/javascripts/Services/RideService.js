app //Our module. Assigned as a global variable in scripts.js


//----------------------------------------------------------------
//----Ride
// ------
//Using $resource
//ngResource required in model
//@paramter $resource
    // -- angular-reource.js required
//--------------------------------------------------------------
.factory('rideFactoryResponse', function($resource, $q){
    var resource =  $resource('/api/rides',
        {},
        {
            update: {method:'PUT'}
        }
    );
    return {
        getRideCreator : function(_userId){
            var deferred = $q.defer();
            var _resource = $resource('/api/user/:id');
            _resource.get(
                {id:_userId},
                function(result){
                    deferred.resolve({status:"success", result : result});
                },
                function(response){
                    deferred.reject({status:"error", result :response});
                }
            );
            return deferred.promise;
        },
        saveRide: function(that, _createdBy, _belongsToGroup, _scheduledForDate){
            var deferred = $q.defer();
            var ride = new resource({
                title: that.title,
                description: that.description,
                url: that.url,
                scheduledForDate: Date.now(),
                createdBy: _createdBy,
                belongsToGroup: _belongsToGroup
            });

            ride.$save(
                function(result){
                    deferred.resolve({status:"success", result : result});
                },
                function(response){
                    deferred.reject({status:"error", result :response});
                }
            );
            return deferred.promise;
        }
    }
});