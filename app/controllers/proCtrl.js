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
      if ($(`#test3${postId}`).is(':checked')) {
        $scope.tenanted = true;
      } else if ($(`#test4${postId}`).is(':checked')) {
        $scope.tenanted = false;
      }
    };

    // Adds a new pro to firebase via the pro modal.
    $scope.addNewPro = function (postId) {
      let postingId = postId;
      let pro1 = $scope.pro1;
      let pro2 = $scope.pro2;
      let pro3 = $scope.pro3;
      let pro4 = $scope.pro4;
      let pro5 = $scope.pro5;
      let pro6 = $scope.pro6;
      let tenanted = $scope.tenanted;
      authFactory.getUser().then(UserObj => {
        user = UserObj;
        }
      )
      .then(
        function () {
          $http.post(
            `${firebaseURL}/posting_pros/${postingId}.json`,
            JSON.stringify({
              uid: user.uid,
              username: user.username,
              tenanted: tenanted,
              pro1: pro1,
              pro2: pro2,
              pro3: pro3,
              pro4: pro4,
              pro5: pro5,
              pro6: pro6
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