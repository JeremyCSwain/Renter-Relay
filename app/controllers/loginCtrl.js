"use strict";

app.controller("loginCtrl", [
	"$scope",
	"$location",
	"$http",
	"authFactory",
	"firebaseURL",

	function ($scope, $location, $http, authFactory, firebaseURL) {

		$('.welcome-line1').hide().fadeIn(2000);
		$('.welcome-line2').hide().fadeIn(6000);

		
		let ref = new Firebase(firebaseURL);

		$scope.account = {email: "", password: ""};
		$scope.newAccount = {email: "", password: "", userName: ""};


		// Registers a new user and creates a new user_data object.
		$scope.register = function () {
			$scope.account = $scope.newAccount;
			ref.createUser({
				// Set user with email and pw
				email: $scope.account.email,
				password: $scope.account.password
			}, function (error, userData) {
				if (error) {
					console.log(`Error creating user: ${error}`);
				} else {
					console.log(`Created user account with UID: ${userData.uid}`, userData);
					authFactory.storeUser(userData.uid, $scope.account.email, $scope.account.userName);
					$scope.login();
				}
			});
		};

		// Authenticates and logs in a previously registered user.
		$scope.login = function () {
			authFactory.authenticate($scope.account)
				.then(function () {
					$location.path("/main");
					$scope.$apply();
					authFactory.getUser();
				})
		};

		// Opens the 'register' modal on click of the 'register' button.
		$scope.openModal = function () {
			$('#modal1').openModal();
		};

	}
]);