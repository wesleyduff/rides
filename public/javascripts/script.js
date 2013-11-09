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
.factory('groupFactory', function($http){
    return {
      getGroup : function(_groupId){
        $http.post('/group/' + _groupId);
      },
      getGroups : function(callback){
        $http.get('/groups').success(callback);
      },
      saveGroup : function(_jsonGroup, callback){
        $http.post('/group/new', _jsonGroup).success(callback);
      }
    }
})

/* ***************************************
**       CONTROLLERS 
**************************************** */
.controller('Ctrl', ['$scope', '$http', 'userFactory', function ($scope, $http, userFactory) {
    $scope.name = 'Whirled';
    $scope.fullName = "Wesley Duff";
    $scope.email = "slysop@gmail.com";
    $scope.submit = function () {
        var user = {
            fullName: this.fullName,
            email: this.email,
            modifiedOn: Date.now(),
            lastLogin: Date.now()
        }
        var jsonUser = JSON.stringify(user);
        var obj = userFactory.saveUser(jsonUser, function(result){
          if(result.status === "error"){
            $('#errorMessage').html('Error saveing user : ' + user.fullName);
          } else {
            $('#errorMessage').html('Saved User: ' + result.name);
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