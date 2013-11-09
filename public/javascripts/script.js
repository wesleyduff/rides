//Build module
angular.module('app', [])
/* ***************************************
**       FACTORIES
**************************************** */
.factory('userFactory', function($http){
  return {
    getUser : function(_userId){
      $http.post('/user/' + _userId);
    },
    getUsers : function(callback){
      $http.get('/users').success(callback);
    },
    saveUser : function(_jsonUser, callback){
      $http.post('/user/new', _jsonUser).success(callback);
    },
    checkForLogedInUser : function(callback){
      $http.get('/checkLoginStatus')
    },
    loginUser : function(_creds, callback){
      $http.post('/login').success(callback);
    }
  }
})
.factory('rideFactory', function($http){
    return {
      getRide : function(_rideId){
        $http.post('/ride/' + _rideId);
      },
      getRides : function(callback){
        $http.get('/rides').success(callback);
      },
      saveRide : function(_jsonRide, callback){
        $http.post('/ride/new', _jsonRide).success(callback);
      }
    }
})
/* ***************************************
**       CONTROLLERS 
**************************************** */
.controller('MainCtrl', ['$scope', '$http', 'userFactory', function ($scope, $http, userFactory) {
    $scope.rides = "Rides"; //doing thi sto make sure angular is working. Remove when tested.
    $scope.initPage = function(){
      var obj = userFactory.checkForLogedInUser(function(result){
        if(result.length > 0 && result[0].status !== "error"){
          $('#loginForm').hide(); //Hide the login because they do not need it.
          //Displaly their name at the top of the page
          $('.login-success-view').text('Hello ' + result.name);
          $('.login-success-view').fadeIn();
          var updatedUser = json.parse(result[0].user);
          updateUser.lastLogin = Date().now();
          //TODO: UPDATE user with id
        }
      });
    }
    $scope.doLogin = function(){
      var creds = {
            email: this.email,
            password: this.password
      };
      var jsonCreds = JSON.stringify(creds);
      var obj = userFactory.loginUser(jsonCreds, function(result){
        if(result.length > 0 && result[0].status === "error"){
          var error = result[0].error, //error is an array. ONLY for this response
              _html;
          for(var i = 0; i < error.length; i++){
            if(i === error.length - 1){
              _html += error[i];
            } else {
              _html += error[i] + "<br />";
            }
          }
          $('.login-error').html(_html);
          $('.login-error').addClass('.error').show(); //add class .error to show red text. Show the DOM element becuase it is hidden on default
        } else {
          $('.login-success-view').text('Hello ' + result.name);
          $('.login-success-view').fadeIn();
          $('#loginForm').hide(); //Hide the login because they do not need it.
        }
      });
    };
}])
.controller('UserPage', ['$scope', function($scope) {
	$scope.name = "User Name";
	$scope.pageName = "User Page Name";
	$scope.email = "email@email.com";
}])
.controller('projectCreate', ['$scope', function($scope){
	$scope.name = "Project Name";
	$scope.submitProjectForm = function(){
		var project = {
			name : this.name
		}
		alert(project.name);
	}
}]);