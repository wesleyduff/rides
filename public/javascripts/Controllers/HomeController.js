app //Our module. Assigned as a global variable in scripts.js


//----------------------------------------------------------------
//----Main Controller
// ------
//--------------------------------------------------------------

.controller('MainCtrl', ['$scope', 'userFactoryResponse', 'groupFactoryResponse', function ($scope, userFactoryResponse, groupFactoryResponse) {
    /* -------------------
     Binded scope objects
     ng-bind
     */
    $scope.loggedInUser = null;
    $scope.allGroups = null;
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
        userFactoryResponse.checkForLogedInUser()
            .then(function(response){
                if(response.status){
                    updateLoginData(response.user);
                } else {
                    $scope.isLoggedIn = false;
                }
            });
        groupFactoryResponse.getAllGroups()
            .then(function(response){
               console.log(response);
            });
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
                  updateLoginData(response);
          });
      } else {
          console.info($scope.registerForm);
      }
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