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
        getRsvpRiders : function(_ride){
            var _resource = $resource('/api/group/:groupid/ride/:rideid/getRsvpRiders');
            var deferred = $q.defer();
            _resource.get(
                {
                    groupid: _ride.belongsToGroup,
                    rideid: _ride._id
                },
                function(result){
                    deferred.resolve({status:"success", result : result});
                },
                function(response){
                    deferred.reject({status:"error", result :response});
                }
            )
            return deferred.promise;
        },
        addRider : function(_ride, _rider) {
          var _resource = $resource('/api/saveRider');
          var deferred = $q.defer();
          var _buildObj = {
              ride : _ride,
              rider : _rider
          };
          var _riderToAdd = new _resource(_buildObj);

          _riderToAdd.$save(
            function(result){
                deferred.resolve({status:"success", result : result});
            },
            function(response){
                deferred.reject({status:"error", result :response});
            }
          );

          return deferred.promise;

        },
        removeRSVPRider : function(_ride, _rider){
            var _resource = $resource('/api/removeRSVPRider');
            var deferred = $q.defer();
            var _buildObj = {
                ride : _ride,
                rider : _rider
            };
            var _riderToRemove = new _resource(_buildObj);

            _riderToRemove.$save(
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