app //Our module. Assigned as a global variable in scripts.js


//----------------------------------------------------------------
//----Main Controller
// ------
//--------------------------------------------------------------

.controller('PageCtrl', ['$scope', 'userFactoryResponse', 'groupFactoryResponse', 'rideFactoryResponse', 'notificationService', function ($scope, userFactoryResponse, groupFactoryResponse, rideFactoryResponse, notificationService) {
    /* -------------------
     Binded scope objects
     ng-bind
     */
        $scope.loggedInUser;
        $scope.allGroups;
        $scope.group;


    /* -------------------
     HOOOKS
     ng-show, ng-hide
     */
        $scope.canShowLogin = true;
        $scope.canShowLoginSuccessView = false;
        $scope.isLoggedIn = false;


    /* -------------------
     On load we need to check if the user has been logged in using the session
     */
    $scope.initPage = function(){
        //check user if they are logged in and give privileges
        userFactoryResponse.checkForLogedInUser()
            .then(function(response){
                if(response.status){
                    updateLoginData(response.user);
                } else {
                    $scope.isLoggedIn = false;
                }
            });

        //Build the data for our APP
        groupFactoryResponse.getAllGroups()
            .then(function(response){
                $scope.allGroups = response;
                $scope.group = $scope.allGroups[0];
            });
    };



    /* -------------------
    On click event to register a new user.
    Created in the register-form.jade template
    */
    $scope.doRegister = function(){
      /* Check to see if form is prestine */
      if ($scope.registerForm.$dirty && $scope.registerForm.$valid) {
          userFactoryResponse.saveUser(this)
              .then(function(response){
                  updateLoginData(response);
          });
      } else {
          console.info($scope.registerForm);
      }
    };


    /* -------------------
     On click event to add ride
     */
        $scope.addNewRide = function(){
            var _scheduledForDate = Date($('#scheduledFor').val()),
                createdBy = $scope.loggedInUser._id,
                belongsToGroup = $scope.group._id;

            rideFactoryResponse.saveRide(this, createdBy, belongsToGroup, _scheduledForDate)
                .then(function(response){
                    if(response.status === "error"){
                        notificationService.notification("User does not exist", $('#new-ride-form form'));
                        return
                    };
                    notificationService.notification("Ride Saved", $('#new-ride-form form'), "info");

                    //update the groups data without making another service call
                    for(var i = 0; i < $scope.allGroups.length; i++){
                        angular.forEach($scope.allGroups[i], function(value, key){
                            if(key === "_id" && value === response.result._id){
                                $scope.allGroups[i].rides.push(ride);
                            }
                        });
                    }
                });
      };


    /* ---------------------------------------------------------
     //     ----    Login User
     //     --------------------------------------------------------- */
    $scope.doLogin = function(){
      var creds = {
            email : this.email,
            password : this.password
      };
        //TODO: need to set up a failure here and show a message
      var jsonCreds = JSON.stringify(creds);
        userFactoryResponse.loginUser(jsonCreds)
            .then(function(response){
                if(response.$resolved && response.status !== "error"){
                    updateLoginData(response);
                } else {
                    notificationService.notification("User does not exist", $('#loginForm'));
                }
            }
        );
    };

    /* -------------------
     Helper functions for DRY
    */
    function updateLoginData(user){
        $scope.isLoggedIn = true;
        $scope.canShowLogin = false;
        user.id = user._id;
        $scope.loggedInUser = user;
        $scope.canShowLoginSuccessView = true;
    }
}]);