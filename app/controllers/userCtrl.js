"use strict";

app.controller("userCtrl", [

	"$scope",
	"$http", 
	"$location",
	"authFactory",

	function ($scope, $http, $location, authFactory) {

		let user = {};

		authFactory.getUser().then(UserObj => {
			user = UserObj;
		});

	// End dependency function
	}
]);