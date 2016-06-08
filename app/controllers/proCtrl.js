"use strict";

app.controller("proCtrl",
[
  "$scope",
  "$location",
  "$http",
  "firebaseURL",
  "authFactory",

  ($scope, $location, $http, firebaseURL, authFactory) => {

    $scope.pro1 = "";
    $scope.pro2 = "";
    $scope.pro3 = "";
    $scope.pro4 = "";
    $scope.pro5 = "";
    $scope.pro6 = "";
    $scope.tenanted = false;

    // Local variables
    let ref = new Firebase(firebaseURL);

    let user = {};
    
    // Get current user object
    authFactory.getUser().then(UserObj => {
      user = UserObj;
      }
    );

    // Check user status as tenant or visitor
    $scope.tenantStatus = function () {
      if ($('#test3').is(':checked')) {
        $scope.tenanted = true;
      } else if ($('#test4').is(':checked')) {
        $scope.tenanted = false;
      }
    };

    // Adds a new pro to firebase via the pro modal.
    $scope.addNewPro = function (postId) {
      $http.post(
        `${firebaseURL}/posting_pros/${postId}.json`,

        JSON.stringify({
          uid: user.uid,
          userName: user.userName,
          tenanted: $scope.tenanted,
          pro1: $scope.pro1,
          pro2: $scope.pro2,
          pro3: $scope.pro3,
          pro4: $scope.pro4,
          pro5: $scope.pro5,
          pro6: $scope.pro6
        })
      )
      .then(
        // Route back to main page
        function () {
          $location.path('#/main');
        }
      )
      .then(
        // Handle resolve
        () => console.log("Successfully added new pros to firebase"),
          $scope.pro1 = "",
          $scope.pro2 = "",
          $scope.pro3 = "",
          $scope.pro4 = "",
          $scope.pro5 = "",
          $scope.pro6 = "",
        // Handle reject
        (response) => console.log(response)  
      );  
    }

  }
]);