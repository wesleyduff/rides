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
    registerUser : function(_jsonUser, callback){
      $http.post('/api/registerUser', _jsonUser).success(callback);
    },
    checkForLogedInUser : function(callback){
      $http.get('/checkLoginStatus').success(callback);
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
      userFactory.checkForLogedInUser(function(result){
        if(result.length && result[0].status === "success"){
          $('#loginForm').remove(); //Hide the login because they do not need it.
          //Displaly their name at the top of the page
          $('.login-success-view').text('Hello ' + result[1].name);
          $('.login-success-view').fadeIn();
          updateUser = result[1];
          updateUser.lastLogin = Date().now;
          //TODO: UPDATE user with id
        };
      });
    };
    $scope.doRegister = function(){
      if($('.raceCategory option:selected').index() == 0){
        $('.registerError').text("Please select your race category");
        return;
      }
      var User = {
        name : this.name,
        email : this.email,
        password : this.password,
        modifiedOn: Date.now(),
        lastLogin: Date.now(),
        cat: this.cat
      }
      var jsonUser = JSON.stringify(User);
      userFactory.registerUser(jsonUser, function(result){
        if(result.length && result[0].status === "error"){
          $('.registerError').text(result[0].error);
        } else {
          $('#register-form button.close').click();//close the modal : Find a better way of doing this
          //show logged in user
          $('.login-success-view').text('Hello ' + result.name);
          $('.login-success-view').fadeIn();
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