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

    // Check user status as tenant or visitor
    $scope.tenantStatus = function (postId) {
      if ($(`#test1${postId}`).is(':checked')) {
        $scope.tenanted = true;
      } else if ($(`#test2${postId}`).is(':checked')) {
        $scope.tenanted = false;
      }
    };

    // Adds a new pro to firebase via the pro modal.
    $scope.addNewPro = function (postId) {
      let postingId = postId;

      authFactory.getUser().then(UserObj => {
        user = UserObj;
        }
      )
      .then(
        function () {
          return tenantStatus();
        }
      )
      .then(
        function () {
          $http.post(
            `${firebaseURL}/posting_pros/${postingId}.json`,
            JSON.stringify({
              uid: user.uid,
              username: user.username,
              tenanted: $scope.tenanted,
              pro1: $scope.pro1,
              pro2: $scope.pro2,
              pro3: $scope.pro3,
              pro4: $scope.pro4,
              pro5: $scope.pro5,
              pro6: $scope.pro6
            })
          )
        }
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