app //Our module. Assigned as a global variable in scripts.js


//----------------------------------------------------------------
//----User
// ------
//Using $resource
//ngResource required in model
//@paramter $resource
    // -- angular-reource.js required
//--------------------------------------------------------------
    .factory('groupFactoryResponse', function($resource, $q){
        /*        return $resource('http://localhost\\:3000/api/users',
         {},
         {
         update: {method:'PUT'}
         }
         );*/
        var resource = $resource('http://localhost\\:3000/api/groups',
            {},
            {
                update: {
                    method:'PUT'
                },
                get : {
                    url : '/api/groups/:id',
                    params : '@id'
                }
            }
        );
        return {
            getGroup: function(groupId){
                var deferred = $q.defer();
                resource.get(
                    {id: groupId},
                    function(_group){
                        deferred.resolve({status: true, group : _group}); //single object expected : Not array
                    },
                    function(response){
                        deferred.reject({status: false, error : response}); //single object expected : Not array
                    }
                );
                return deferred.promise;
            },
            getAllGroups: function() {
                var deferred = $q.defer();
                resource.query(
                    {},
                    function(_groups){
                        //add domID and RideId to use in the DOM
                        for(var i = 0; i < _groups.length; i++){
                            _groups[i].domId = _groups[i]._id;
                            for(var k = 0; k < _groups[i].rides.length; k++){
                                _groups[i].rides[k].rideId = _groups[i].rides[k]._id;
                            }
                        }
                        deferred.resolve(_groups);
                    },
                    function(response){
                        deferred.reject(response);
                    }
                ); //array is expected to be returned
                return deferred.promise;
            }

        }
    });
