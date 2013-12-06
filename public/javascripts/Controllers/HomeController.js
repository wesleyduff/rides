app //Our module. Assigned as a global variable in scripts.js


//----------------------------------------------------------------
//----Main Controller
// ------
//--------------------------------------------------------------

.controller('MainCtrl', ['$scope', 'userFactoryResponse', 'groupFactoryResponse', 'rideFactoryResponse', function ($scope, userFactoryResponse, groupFactoryResponse, rideFactoryResponse) {
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
             var _scheduledForDate = new Date($('#scheduledFor input').val());
             console.log(_scheduledForDate);
             var ride = new rideFactoryResponse({
                 title: this.title,
                 description: this.description,
                 url: this.url,
                 scheduledForDate: _scheduledForDate,
                 createdBy: this.userId,
                 belongsToGroup: $scope.group._id
             });
             ride.$save(function(result){
                console.log(result);
                if(result.status === "error"){
                    alert('Error creating ride. Contact system admin.');
                    return;
                };
                $('#newRideModalHeader').html('<div class="text-info">Ride Saved</div>');
                setTimeout(function(){
                    var temp = $('#newRideModalHeader .text-info');
                    temp.fadeOut();
                    temp.remove();
                    $('#newRideModalHeader').text('Crete a New Ride');
                }, 5000);

                 //update the groups data without making another service call
                 for(var i = 0; i < $scope.allGroups.length; i++){
                    angular.forEach($scope.allGroups[i], function(value, key){
                        if(key === "_id" && value === result._id){
                            $scope.allGroups[i].rides.push(ride);
                        }
                    });
                 }
        });
      };


    /* -------------------
     Helper functions for DRY
    */
    function updateLoginData(user){
        $scope.isLoggedIn = true;
        $scope.canShowLogin = false;
        $scope.loggedInUser = user;
        $scope.canShowLoginSuccessView = true;
    }
}]);