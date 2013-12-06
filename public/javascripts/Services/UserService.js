app //Our module. Assigned as a global variable in scripts.js


//----------------------------------------------------------------
//----User
// ------
//Using $resource
//ngResource required in model
//@paramter $resource
    // -- angular-reource.js required
//--------------------------------------------------------------
    .factory('userFactoryResponse', function($resource, $q){
        var resource = $resource('/api/user',
            {},
            {
                update: {
                    method:'PUT'
                },
                get : {
                    url : '/api/user/:id',
                    params : '@id'
                }
            }
        );
        return {
            loginUser: function (_creds) {
                var deferred = $q.defer();
                $resource('/api/login').save(
                    _creds,
                    function(_user){
                        console.log("data");
                        console.log(_user);
                        deferred.resolve(_user);
                    },
                    function(response){
                        console.log('response');
                        console.log(response);
                        deferred.reject(response);
                    }
                );
                return deferred.promise;

            },
            checkForLogedInUser: function(){
                var res = $resource('/api/checkLoginStatus');
                var deferred = $q.defer();
                var returnObj = {};
                res.get({},
                    function(response){
                        if(response.status){
                            returnObj.status = true;
                            returnObj.user = response.user;
                            deferred.resolve(returnObj);
                            //returnObj.user = response.user;
                        } else {
                            returnObj.status = false;
                            deferred.reject(returnObj);
                        }
                    }, function(){
                        returnObj.status = false;
                        returnObj.error = "Request Failed";
                        deferred.reject(returnObj);
                    }
                );
                return deferred.promise;
            },
            getUser: function(userId){
                var deferred = $q.defer();
                resource.get({id: userId},
                    function(user){
                        deferred.resolve(user); //single object expected : Not array
                    },
                    function(response){
                        deferred.reject(response); //single object expected : Not array
                    }
                );
                return deferred.promise;
            },
            saveUser: function(that){
                var deferred = $q.defer();
                var user =
                    {
                        "name" : that.name,
                        "email": that.email,
                        "password" : that.password,
                        "modifiedOn" : Date.now(),
                        "lastLogin" : Date.now(),
                        "cat" : that.cat
                    }
                resource.save(user,
                    function(response){ deferred.resolve(response);}, //single object expected : Not array
                    function(response){ deferred.reject(response);} //single object expected : Not array
                );
                return deferred.promise;
            },
            getAllUsers: function() {
                return resource.query(); //array is expected to be returned
            }

        }
    })
