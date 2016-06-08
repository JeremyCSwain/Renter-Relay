"use strict";

app.controller("navCtrl",
[
  "$scope",
  "$location",
  "$http",
  "authFactory",
  "firebaseURL",

  ($scope, $location, $http, authFactory, firebaseURL) => {

    // Local variables
    let ref = new Firebase(firebaseURL);

    $(".button-collapse").sideNav();

    // Use Firebase through AuthFactory to verify authentication of user
    $scope.isAuthenticated = () => {
      return authFactory.isAuthenticated();
    };

    // Unauth through Firebase/LogOut
    $scope.logout = () => {
      console.log("User is logged out.");
      ref.unauth();
    };

  }
]);
