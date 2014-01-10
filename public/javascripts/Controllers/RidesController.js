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
        $scope.pageTitle = "Back";  /* String */
        $scope.ride;                /* Object */
        $scope.group;               /* Object */
        $scope.createdUser;         /* Object */
        $scope.ridersAttending;     /* Array */
        $scope.showRsvp = false;     /* Bool */


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
                    $scope.group = {
                        id : response.group._id,
                        rides : response.group.rides
                    };
                    for(var i = 0; i < $scope.group.rides.length; i++){
                        if($scope.group.rides[i]._id == rideId){
                            $scope.ride = $scope.group.rides[i];
                        }
                    };

                    rideFactoryResponse.getRideCreator($scope.ride.createdBy)
                        .then(function(response){
                            if(response.status === "success"){
                                $scope.createdUser = response.result;
                            }
                        });

                    rideFactoryResponse.getRsvpRiders($scope.ride)
                        .then(function(response){
                            if(response.status === "success"){
                                //Check to see if the current user is in the list of RSVP riders or if the
                                //user is the one who created the ride.
                                checkRidersRSVP(response.result.result.riders)
                                $scope.ridersAttending = response.result.result.riders;
                            }
                        })

                    function checkRidersRSVP(RSVPriders){
                        if(typeof $scope.loggedInUser === "object"){
                            $scope.showRsvp = true;
                            for(var i = 0; i < RSVPriders.length; i++){

                                if(RSVPriders[i].id == $scope.loggedInUser.id){
                                   $scope.showRsvp = false;
                                }
                            }
                        }
                    }

                });

        };

        /* -------------------
         allow logged in user to register for ride if they are not the ride creator
         */
        $scope.addRider = function(){
            rideFactoryResponse.addRider($scope.ride, $scope.loggedInUser)
                .then(function(response){
                    if(response.status === "success"){
                        $scope.ridersAttending = response.result.result.riders;
                        $scope.showRsvp = false;
                    } else if(response.type === "error" && reponse.result.riders.length) {
                        console.log(response.type);
                        $scope.ridersAttending = response.result.result.riders;
                    }

                });

        };

        $scope.removeRSVPRider = function(){
            rideFactoryResponse.removeRSVPRider($scope.ride, $scope.loggedInUser)
                .then(function(response){
                    if(response.status === "success"){
                        $scope.ridersAttending = response.result.result.riders;
                        $scope.showRsvp = true;
                    } else if(response.type === "error" && response.result.riders.length) {
                    }
                });
        };
    }]);