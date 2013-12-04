app //Our module


//----------------------------------------------------------------
//----User
// ------
//Using $resource
//ngResource required in model
//@paramter $resource
    // -- angular-reource.js required
//--------------------------------------------------------------
    .factory('userFactoryResponse', function($resource, $q){
        /*        return $resource('http://localhost\\:3000/api/users',
         {},
         {
         update: {method:'PUT'}
         }
         );*/
        var resource = $resource('http://localhost\\:3000/api/user/:id', {id: '@id'});
        return {
            getUser: function(userId){
                var deferred = $q.defer();
                resource.get({id: userId},
                    function(user){
                        deferred.resolve(user);
                    },
                    function(response){
                        deferred.reject(response);
                    }
                )
            },
            saveUser: function(user){
              var deferred = $q.defer();
              resource.save(user,
                function(response){ deferred.resolve(response);},
                function(response){ deferred.reject(response);}
              )
            },
            getAllUsers: function() {
                return resource.query();
            }

        }
//    return $resource('http://localhost\\:3000/api/users',
//        {},
//        {
//            update: {method:'PUT'}
//        }
//    );
    })
