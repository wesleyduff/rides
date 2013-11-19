//Build module
angular.module('app', ['ngResource'])
/* ***************************************
**       FACTORIES
**************************************** */
.factory('userFactoryResponse', function($resource){
    return $resource('http://localhost\\:3000/api/users');
})
.factory('userFactory', function($http){
  return {
    getUser : function(_userId){
      $http.post('/api/user/' + _userId);
    },
    getUsers : function(callback){
      $http.get('/api/users').success(callback);
    },
    registerUser : function(_jsonUser, callback){
      $http.post('/api/registerUser', _jsonUser).success(callback);
    },
    checkForLogedInUser : function(callback){
      $http.get('/api/checkLoginStatus').success(callback);
    },
    loginUser : function(_creds, callback){
      $http.post('/api/login', _creds).success(callback);
    }
  }
})
.factory('rideFactory', function($http){
    return {
      getRide : function(_rideId){
        $http.post('/api/ride/' + _rideId);
      },
      getRides : function(callback){
        $http.get('/api/rides').success(callback);
      },
      saveRide : function(_jsonRide, callback){
        $http.post('/api/ride/new', _jsonRide).success(callback);
      }
    }
})
/* ***************************************
**       CONTROLLERS 
**************************************** */

//----------------------------------------------------------------
//----Main Controller
// ------
//TODO:
//Make DRY - refactor
//--------------------------------------------------------------
.controller('MainCtrl', ['$scope', '$http', 'userFactory', 'rideFactory', 'userFactoryResponse', function ($scope, $http, userFactory, rideFactory, userFactoryResponse) {
    $scope.userId;
    $scope.rides = "Rides"; //doing thi sto make sure angular is working. Remove when tested.

    //Example of using $resource
    //Remove this
    $scope.getUsers = function(){
        userFactoryResponse.query(function(_users){
            //success
            console.log(_users)
        });
    }

    $scope.initPage = function(){
      userFactory.checkForLogedInUser(function(result){
        if(result.length && result[0].status === "success"){
          $('#loginForm').remove(); //Hide the login because they do not need it.
          //Displaly their name at the top of the page
          $('.login-success-view').text('Hello ' + result[1].name);
          $('.login-success-view').fadeIn();
          $scope.userId = result[1]._id;
          updateUser = result[1];
          updateUser.lastLogin = Date().now;
          //TODO: UPDATE user with id 
          //TODO: Save Updated user back to the DB
        };
      });
    };
    
    $scope.doRegister = function(){ //Register a new user action
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
      userFactory.registerUser(jsonUser, function(result){ //call factory API to register a new user
        if(result.length && result[0].status === "error"){
          $('.registerError').text(result[0].error); //show error that has happened
        } else {
          $('#loginForm').remove(); //Hide the login because they do not need it.
          $('#register-form button.close').click();//close the modal : Find a better way of doing this
          $scope.userId = result._id;
          //show logged in user
          $('.login-success-view').text('Hello ' + result.name);
          $('.login-success-view').fadeIn();
        }
      });
    }

    //This is not yet implmeent in the backend
    $scope.doLogin = function(){
      var creds = {
            email : this.email,
            password : this.password
      };
      var jsonCreds = JSON.stringify(creds);
      userFactory.loginUser(jsonCreds, function(result){
        if(result.length && result[0].status === "error"){
          var error = result[0].error, //error is an array. ONLY for this response
              _html = "";
          for(var i = 0; i < error.length; i++){
            if(i === error.length - 1){
              _html += error[i];
            } else {
              _html += error[i] + "<br />";
            }
          }
          $('.login-message').html(_html);
          $('.login-message').show(); //add class .error to show red text. Show the DOM element becuase it is hidden on default
        } else {
          $scope.userId = result._id;
          $('.login-success-view').text('Hello ' + result.name);
          $('.login-success-view').fadeIn();
          $('#loginForm').hide(); //Hide the login because they do not need it.
        }
      });
    };

    //Add a new ride
    $scope.addNewRide = function(){
      var   _userId = this.userId,
            _scheduledDate = Date.now(),
            ride =  {
              title: this.title,
              description: this.description,
              url: this.url,
              scheduledForDate: _scheduledDate,
              createdBy: _userId,
              belongsToGroup: this.cat
            },
            jsonRide = JSON.stringify(ride);
        rideFactory.saveRide(jsonRide, function(result){
            if(result.length && result[0].status === "error"){
                $('.newRideError').text(result[0].error); //show error that has happened
            } else {
                $('#newRideModalHeader').html('<div class="text-info">Ride Saved</div>');
                setTimeout(function(){
                   var temp = $('#newRideModalHeader .text-info');
                   temp.fade(600);
                   temp.remove();
                   $('#newRideModalHeader').text('Crete a New Ride');
                }, 1000);
            }
        });

    };
}]);


/* ***********************
** JQUERY Methods -
* - May be better to turn these into directives instead.
* TODO: Chage to directives
 */
$(function(){
    //document ready

    /*
    Close the collapsible nav bar after you select an item from the menu.
    If this is removed then you have to click on the collapse button again to close the collapsible nav bar
     */
    $('.nav-collapse a').bind('click', function(){
        $('.btn-navbar').click();
    });
});