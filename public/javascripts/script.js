/* ***************************************
 **       MODULE
 **************************************** */


//----------------------------------------------------------------
//----App
// ------
//@inject ngResouce
  // -- angular-resource.js required
  // -- using ngResource for RESTful calls to api service
//--------------------------------------------------------------
var app = angular.module('app', ['ngResource']);

angular.module('app')


/* ***************************************
**       FACTORIES
**************************************** */


//----------------------------------------------------------------
//----Ride
// ------
//Using Custom $http promise calls
//@parameter $http required
    // -- part of angular.js
//--------------------------------------------------------------
    .factory('userFactory', function ($http) {
        return {
            checkForLogedInUser: function (callback) {

                $http.get('/api/checkLoginStatus').success(callback);
            },
            loginUser: function (_creds, callback) {
                $http.post('/api/login', _creds).success(callback);
            },
            logOut: function (callback) {
                $http.get('/api/logout').success(callback);
            }
        };
    })



//----------------------------------------------------------------
//----Ride
// ------
//Using $resource
//ngResource required in model
//@paramter $resource
    // -- angular-reource.js required
//--------------------------------------------------------------
.factory('rideFactoryResponse', function($resource){
    return $resource('http://localhost\\:3000/api/rides',
        {},
        {
            update: {method:'PUT'}
        }
    );
})


//----------------------------------------------------------------
//----Ride
// ------
//Using Custom $http promise calls
//@parameter $http required
    // -- part of angular.js
//--------------------------------------------------------------
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


//----------------------------------------------------------------
//----Group
// ------
//Using $resource
//ngResource required in model
//@paramter $resource
    // -- angular-reource.js required
//--------------------------------------------------------------
.factory('groupFactoryResponse', function($resource){
    return $resource('http://localhost\\:3000/api/groups',
        {},
        {
            update: {method:'PUT'},
            get : {
                url : '/groups/:id',
                params : '@id'
            }
        }
    );
})
.factory('groupFactory', function($http){
    return {
       getGroup : function(_groupId, callback){
            $http.get('/api/groups/' + _groupId).success(callback);
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
.controller('MainCtrlOld', ['$scope', '$http', 'userFactory', 'rideFactory', 'userFactoryResponse', 'rideFactoryResponse', 'groupFactoryResponse', function ($scope, $http, userFactory, rideFactory, userFactoryResponse, rideFactoryResponse, groupFactoryResponse) {
    $scope.userId;
    $scope.hideLogin = false;
    $scope.PageTitle = "Rides"; //doing thi sto make sure angular is working. Remove when tested.

    /* ---------------------------------------------------------
     ----    Get All Users
     --------------------------------------------------------- */
    $scope.getUsers = function(){
        userFactoryResponse.query(function(_users){
            //success
            console.log(_users)
        });
    };

    $scope.allGroups;
    $scope.group;

    /* ---------------------------------------------------------
     ----    init function
     --------------------------------------------------------- */
    $scope.initPage = function(){
        $scope.allGroups = groupFactoryResponse.query(function(){
            for(var i = 0; i < $scope.allGroups.length; i++){
                $scope.allGroups[i].domId = $scope.allGroups[i]._id;
                for(var k = 0; k < $scope.allGroups[i].rides.length; k++){
                    $scope.allGroups[i].rides[k].rideId = $scope.allGroups[i].rides[k]._id;
                }
            }
            $scope.group = $scope.allGroups[0];
        });



      userFactory.checkForLogedInUser(function(result){
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
      });
    };


    /* ---------------------------------------------------------
    ----    Register User
    --------------------------------------------------------- */
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


    /* ---------------------------------------------------------
     ----    Login User
     --------------------------------------------------------- */
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


    /* ---------------------------------------------------------
     ----    Logout User
     --------------------------------------------------------- */
    $scope.logOut = function(){
        userFactory.logOut(function(result){
            if(result.status === "success"){
                $('.login-success-view').text();
                $('.login-success-view, .logout-view').hide();
                $('#loginForm').show(); //Hide the login because they do not need it.
            }
        });
    }


    /* ---------------------------------------------------------
     ----    Add A New Ride
     --------------------------------------------------------- */
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
            }
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

     $scope.manageActiveState = function(elem){
         console.log(angular.element(elem));
         angular.element('elem').addClass('active');
     }
}])




//----------------------------------------------------------------
//----Ride Controller
// ------
//--------------------------------------------------------------
.controller('rideController', ['$scope', 'groupFactory', function($scope, groupFactory){
        $scope.pageTitle = "Back";
        $scope.ride;
        $scope.group;
        //Initialize the scope for rideCtrl
            /* ---------------------------------------------------------
             ----    Get All Groups
             ---------------------------------------------------------- */
        console.log($scope.allGroups.length);
        $scope.initRidePage = function(groupId, rideId){
            $scope.group = groupFactory.getGroup(groupId, function(result){
                for(var i = 0; i < result.rides.length; i++){
                    console.log(result.rides[i].title);
                    if(result.rides[i]._id == rideId){
                        $scope.ride = result.rides[i];
                    }
                }
            });
        };

}])

.directive("page", function(){
    return {
        restrict: 'A',
        link: function(scope, elem, attrs){
            elem.parents('body').find('.navbar-brand').text('Back')
        }
    }
})




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
    $('.navbar-nav a').bind('click', function(){
        $('.navbar-toggle').click();
    });
});