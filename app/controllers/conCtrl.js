"use strict";

app.controller("conCtrl",
[
  "$scope",
  "$location",
  "$http",
  "firebaseURL",
  "authFactory",

  ($scope, $location, $http, firebaseURL, authFactory) => {

    $scope.con1 = "";
    $scope.con2 = "";
    $scope.con3 = "";
    $scope.con4 = "";
    $scope.con5 = "";
    $scope.con6 = "";
    $scope.tenanted = false;

    // Local variables
    let ref = new Firebase(firebaseURL);

    let user = {};
    
    // Get current user object
    authFactory.getUser().then(UserObj => {
      user = UserObj;
      }
    );

    // Check tenant status
    $scope.tenantStatus = function () {
      if ($('#test5').is(':checked')) {
        $scope.tenanted = true;
      } else if ($('#test6').is(':checked')) {
        $scope.tenanted = false;
      }
    };

    // Adds a new pro to firebase via the pro modal.
    $scope.addNewCon = function (postId) {
      $http.post(
        `${firebaseURL}/posting_cons/${postId}.json`,

        JSON.stringify({
          uid: user.uid,
          userName: user.userName,
          tenanted: true,
          con1: $scope.con1,
          con2: $scope.con2,
          con3: $scope.con3,
          con4: $scope.con4,
          con5: $scope.con5,
          con6: $scope.con6
        })
      )
      .then(
        // Redirect to main
        function () {
          $location.path('#/main');
        }
      )
      .then(
        // Handle resolve
        () => console.log("Successfully added new cons to firebase"),
          $scope.con1 = "",
          $scope.con2 = "",
          $scope.con3 = "",
          $scope.con4 = "",
          $scope.con5 = "",
          $scope.con6 = "",
        // Handle reject
        (response) => console.log(response)  
      );  
    }

  }
]);