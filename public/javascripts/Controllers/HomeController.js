app //Our module. Assigned as a global variable in scripts.js


//----------------------------------------------------------------
//----Main Controller
// ------
//--------------------------------------------------------------

.controller('PageCtrl', ['$scope', 'groupFactoryResponse', 'notificationService', function ($scope, groupFactoryResponse, notificationService) {
    /* -------------------
     Binded scope objects
     ng-bind
     */
        $scope.allGroups;
        $scope.group;


    /* -------------------
     HOOOKS
     ng-show, ng-hide
     */


    /* -------------------
     On load we need to check if the user has been logged in using the session
     */
    $scope.initPage = function(){

        //Build the data for our APP
        groupFactoryResponse.getAllGroups()
            .then(function(response){
                $scope.allGroups = response;
                $scope.group = $scope.allGroups[0];
            });
    };
}]);