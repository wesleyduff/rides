app //Our module. Assigned as a global variable in scripts.js


//----------------------------------------------------------------
//----Main Controller
// ------
//--------------------------------------------------------------

    .controller('RideController', ['$scope', 'groupFactoryResponse', function ($scope, groupFactoryResponse) {
        /* -------------------
         Binded scope objects
         ng-bind
         */
        $scope.pageTitle = "Back";
        $scope.ride;
        $scope.group;


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
                    if(response.status){
                        //success
                        $scope.group = response.group;
                        for(var i = 0; i < response.group.rides.length; i++){
                            console.log(response.group.rides[i].title);
                            if(response.group.rides[i]._id == rideId){
                                $scope.ride = response.group.rides[i];
                            }
                        }
                    } else {
                        //failed
                    }
                });
        };

    }]);