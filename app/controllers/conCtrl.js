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
    
    // Check tenant status
    $scope.tenantStatus = function () {
      if ($('#test5').is(':checked')) {
        $scope.tenanted = true;
      } else if ($('#test6').is(':checked')) {
        $scope.tenanted = false;
        console.log("??");
      }
    };

    // Adds a new pro to firebase via the pro modal.
    $scope.addNewCon = function (postId) {
      let postingId = postId;
      let con1 = $scope.con1;
      let con2 = $scope.con2;
      let con3 = $scope.con3;
      let con4 = $scope.con4;
      let con5 = $scope.con5;
      let con6 = $scope.con6;
      let tenanted = $scope.tenanted;
      authFactory.getUser().then(UserObj => {
        user = UserObj;
        }
      )
      .then(
        function () {        
          $http.post(
            `${firebaseURL}/posting_cons/${postingId}.json`,
            JSON.stringify({
              uid: user.uid,
              username: user.username,
              tenanted: tenanted,
              con1: con1,
              con2: con2,
              con3: con3,
              con4: con4,
              con5: con5,
              con6: con6
            })
          )
        }
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