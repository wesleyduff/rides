app //Our module. Assigned as a global variable in scripts.js


//----------------------------------------------------------------
//----Main Controller
// ------
//TODO:
//Make DRY - refactor
//--------------------------------------------------------------

.controller('MainCtrl', ['$scope', 'userFactoryResponse', function ($scope, userFactoryResponse) {
//   userFactoryResponse.saveUser({
//        "name" : "Westtsssy",
//        "email": "slyssops1s2s@gmail.com",
//        "password" : "aaas",
//        "modifiedOn" : Date.now(),
//        "lastLogin" : Date.now(),
//        "cat" : 4
//    }).then(function(response){
//       $scope.user = {
//           id : response._id,
//           name : response.name,
//           email : response.email
//       };
//    });

       /* -------------------
        On click event to register a new user.
        Created in the register-form.jade template
       */
      $scope.doRegister = function(){
          /* Check to see if form is prestine */
          if ($scope.registerForm.$dirty && $scope.registerForm.$valid) {
              console.info("clean : " +  $scope.registerForm);
          } else {
              console.info($scope.registerForm);
          }
      };
}]);