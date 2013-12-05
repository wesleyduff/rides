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
                resource.get({id: groupId},
                    function(_group){
                        deferred.resolve(_group); //single object expected : Not array
                    },
                    function(response){
                        deferred.reject(response); //single object expected : Not array
                    }
                );
                return deferred.promise;
            },
            getAllGroups: function() {
                var deferred = $q.defer();
                resource.query(
                    {},
                    function(_groups){
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
