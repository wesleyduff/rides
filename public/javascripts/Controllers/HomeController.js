app //Our module. Assigned as a global variable in scripts.js


//----------------------------------------------------------------
//----Main Controller
// ------
//--------------------------------------------------------------

.controller('MainCtrl', ['$scope', 'userFactoryResponse', function ($scope, userFactoryResponse) {
    /* -------------------
     Binded scope objects
     ng-bind
     */
    $scope.userName = null;
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
        var checkForLogin = userFactoryResponse.checkForLogedInUser();
        if(checkForLogin.status){
            $scope.isLoggedIn = true;
            console.log('signed in user');
            console.log(checkforLogin.user);
        } else {
            $scope.isLoggedIn = false;
            console.log('no user signed in');
        }
        /*userFactory.checkForLogedInUser(function(result){
         if(result[0].status === "success"){
         $('#loginForm').hide(); //Hide the login because they do not need it.
         //Displaly their name at the top of the page
         $('.login-success-view').text('Hello ' + result[1].name);
         $('.login-success-view, .logout-view').fadeIn();
         $scope.userId = result[1]._id;
         updateUser = result[1];
         updateUser.lastLogin = Date().now;
         userFactoryResponse.update({}, updateUser, function(){
         console.log('user updated');
         });
         $scope.hideLogin = true; //We need to hide the login because we no longer need it displayed
         } else {
         $scope.hideLogin = false;
         }
         });*/
    }

    /* -------------------
    On click event to register a new user.
    Created in the register-form.jade template
    */
    $scope.doRegister = function(){
      /* Check to see if form is prestine */
      if ($scope.registerForm.$dirty && $scope.registerForm.$valid) {
          userFactoryResponse.saveUser(this)
              .then(function(response){
              $scope.canShowLogin = false;
              $('#register-form button.close').click();
              $scope.userName = response.name;
              $scope.canShowLoginSuccessView = true;
          });
      } else {
          console.info($scope.registerForm);
      }
    };

}]);