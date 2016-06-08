"use strict";

let app = angular.module("RenterRelay", ["ngRoute", "firebase", "ngFileUpload", "ui.materialize"]).constant("firebaseURL", "https://renter-relay.firebaseio.com/");

// Creates a promise for each view that requires user authentication before resolving.
let isAuth = (authFactory) => new Promise(function (resolve, reject) {
	if (authFactory.isAuthenticated()) {
		console.log("User is authenticated, resolve route promise.");
		resolve();
	} else {
		console.log("User is not authenticated, reject route promise.");
		reject();
	}
});

// Routings for partials and their controllers for user views.
app.config(["$routeProvider",
	function ($routeProvider) {
		$routeProvider.
			when("/login", {
				templateUrl: "partials/login.html",
				controller: "loginCtrl"
			}).
			when("/main", {
				templateUrl: "partials/main.html",
				controller: "pageCtrl",
				resolve: {isAuth}
			}).
			when("/add-property", {
				templateUrl: "partials/add-property.html",
				controller: "addPropCtrl",
				resolve: {isAuth}
			}).
			otherwise({
				redirectTo: "/main"
			});
	}]);

// On app load, redirect user to the login page if not authenticated.
app.run([
  "$location",
  "firebaseURL",

  function ($location, firebaseURL) {
    let appRef = new Firebase(firebaseURL);

    // If user is unauthenticated, reroute to login page.
    appRef.onAuth(authData => {
      if (!authData) {
        console.log("Unauthenticated user.");
        $location.path("/login");
      }
    });
  }
]);












