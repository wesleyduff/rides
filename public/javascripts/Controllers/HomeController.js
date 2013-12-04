app //Our module. Assigned as a global variable in scripts.js


//----------------------------------------------------------------
//----Main Controller
// ------
//TODO:
//Make DRY - refactor
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