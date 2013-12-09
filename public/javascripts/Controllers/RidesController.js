app //Our module. Assigned as a global variable in scripts.js


//----------------------------------------------------------------
//----Main Controller
// ------
//--------------------------------------------------------------

    .controller('RideController', ['$scope', 'groupFactoryResponse', 'rideFactoryResponse', function ($scope, groupFactoryResponse, rideFactoryResponse) {
        /* -------------------
         Binded scope objects
         ng-bind
         */
        $scope.pageTitle = "Back";
        $scope.ride;
        $scope.group;
        $scope.createdUser;


        /* -------------------
         HOOOKS
         ng-show, ng-hide
         */


        /* -------------------
         On load we need to check if the user has been logged in using the session
         */
        $scope.initRidePage = function(groupId, rideId){
            groupFactoryResponse.getGroup(groupId)
                .then(function(response){
                    console.log(response);
                    $scope.group = {
                        id : response.group._id,
                        rides : response.group.rides
                    };
                    for(var i = 0; i < $scope.group.rides.length; i++){
                        console.log($scope.group.rides[i].title);
                        if($scope.group.rides[i]._id == rideId){
                            $scope.ride = $scope.group.rides[i];
                        }
                    };

                    rideFactoryResponse.getRideCreator($scope.ride.createdBy)
                        .then(function(response){
                            if(response.status === "success"){
                                console.log("user");
                                console.log(response);
                                $scope.createdUser = response.result;
                            }
                        });

                });

        };

    }]);