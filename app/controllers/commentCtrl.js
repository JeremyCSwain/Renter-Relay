"use strict";

app.controller("commentCtrl",
[
  "$scope",
  "$location",
  "$http",
  "firebaseURL",
  "authFactory",

  ($scope, $location, $http, firebaseURL, authFactory) => {


    // Local variables
    let ref = new Firebase(firebaseURL);
    let user = {};

    $scope.newComment = "";
    $scope.tenanted;


    // Checks radio button input from user to determine tenant or visited status
    $scope.tenantStatus = function () {
      if ($('#test1').is(':checked')) {
        $scope.tenanted = true;
      } else if ($('#test2').is(':checked')) {
        $scope.tenanted = false;
      }
    };

    // Adds a new comment to firebase via the comment modal.
    $scope.addNewComment = function (postId) {
      let postingId = postId;
      let userComment = $scope.newComment;
      let tenanted = $scope.tenanted;

      return authFactory.getUser().then(UserObj => {
        user = UserObj;
        }
      )
      .then(
        function () {
          $http.post(
            `${firebaseURL}/comments/${postingId}.json`,
            JSON.stringify({
              id: postingId,
              uid: user.uid,
              username: user.username,
              tenanted: tenanted,
              is_owner: user.is_owner,
              user_comment: userComment
            }
          )
        )}
      )
      .then(
        // After adding comment to database, return to the main portal
        function () {
          $location.path('#/main');
        }
      )
      .then(
        // Handle resolve
        () => console.log("Successfully added new comment to firebase"),
        $scope.newComment = "",
        // Handle reject
        (response) => console.log(response)  
      );  
    }

  }
]);