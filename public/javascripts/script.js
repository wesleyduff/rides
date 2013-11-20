//Build module
angular.module('app', ['ngResource'])
/* ***************************************
**       FACTORIES
**************************************** */
.factory('userFactoryResponse', function($resource){
    return $resource('http://localhost\\:3000/api/users',
        {},
        {
            update: {method:'PUT'}
        }
    );
})
.factory('userFactory', function($http){
  return {
    checkForLogedInUser : function(callback){
      $http.get('/api/checkLoginStatus').success(callback);
    },
    loginUser : function(_creds, callback){
      $http.post('/api/login', _creds).success(callback);
    },
    logOut : function(callback){
        $http.get('/api/logout').success(callback);
    }
  }
})
.factory('rideFactoryResponse', function($resource){
    return $resource('http://localhost\\:3000/api/rides',
        {},
        {
            update: {method:'PUT'}
        }
    );
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
        $http.post('/api/rides', _jsonRide).success(callback);
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
.controller('MainCtrl', ['$scope', '$http', 'userFactory', 'rideFactory', 'userFactoryResponse', 'rideFactoryResponse', function ($scope, $http, userFactory, rideFactory, userFactoryResponse, rideFactoryResponse) {
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
        };
      });
    };
    
    $scope.doRegister = function(){ //Register a new user action
      if($('.raceCategory option:selected').index() == 0){
        $('.registerError').text("Please select your race category");
        return;
      }
      var user = new userFactoryResponse({
          name : this.name,
          email : this.email,
          password : this.password,
          modifiedOn: Date.now(),
          lastLogin: Date.now(),
          cat: this.cat
      });
       user.$save(function(_user){
            console.log('user from $save : ' + user);
            $('#loginForm').hide(); //Hide the login because they do not need it.
            $('#register-form button.close').click();//close the modal : Find a better way of doing this
            $scope.userId = _user._id;
            //show logged in user
            $('.login-success-view').text('Hello ' + _user.name);
            $('.login-success-view').fadeIn();
       });
    }

    //This is not yet implmeent in the backend
    $scope.doLogin = function(){
        if($('.login-message:visible').length){
            $('.login-message:visible').hide().html();
        }
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
          $('.login-success-view, .logout-view').fadeIn();
          $('#loginForm').hide(); //Hide the login because they do not need it.
        }
      });
    };

    //Log out a user
    $scope.logOut = function(){
        userFactory.logOut(function(result){
            if(result.status === "success"){
                $('.login-success-view').text();
                $('.login-success-view, .logout-view').hide();
                $('#loginForm').show(); //Hide the login because they do not need it.
            }
        });
    }
    //Add a new ride
    $scope.addNewRide = function(){
        var ride = new rideFactoryResponse({
              title: this.title,
              description: this.description,
              url: this.url,
              scheduledForDate: this.scheduledForDate,
              createdBy: this.userId,
              belongsToGroup: this.cat
        });
        ride.$save(function(_ride){
            $('#newRideModalHeader').html('<div class="text-info">Ride Saved</div>');
            setTimeout(function(){
               var temp = $('#newRideModalHeader .text-info');
               temp.fade(600);
               temp.remove();
               $('#newRideModalHeader').text('Crete a New Ride');
            }, 1000);
        });
    };
}])
.controller('ridesCtrl', ['$scope', function($scope){
    $scope.rides;
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