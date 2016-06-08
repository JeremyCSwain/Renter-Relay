"use strict";

app.controller("photoCtrl",
[
  "$scope",
  "$location",
  "$http",
  "firebaseURL",
  "Upload",
  "authFactory",

  ($scope, $location, $http, firebaseURL, Upload, authFactory) => {

    // Local variables
    let ref = new Firebase(firebaseURL);

    $scope.image = "";

    let user = {};
    
    // Get current user object
    authFactory.getUser().then(UserObj => {
      user = UserObj;
      }
    );

    // Adds a new image to firebase via the photo modal.
    $scope.setNewImage = function (files) {
      Upload.base64DataUrl(files).then(
        function (base64URLs) {
          $scope.image = base64URLs[0];
          console.log("Images successfully stored");
        }
      )
    };

    // Adds a new photo posting to firebase.
    $scope.addNewPhotos = function (postId) {
      $http.post(
        `${firebaseURL}/posting_images/${postId}.json`,
        JSON.stringify({
          uid: user.uid,
          userName: user.userName,
          image: $scope.image
        })
      )
      .then(
        // Route back to main view
        function () {
          $location.path('#/main');
        }
      )
      .then(
          // Handle resolve
        () => console.log("Successfully added new image to firebase"),
        $scope.image = "",
          // Handle reject
        (response) => console.log(response)  
      );  
    };
  }

]);











