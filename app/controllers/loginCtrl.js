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
		$scope.newAccount = {username: ""};

		// Radio button input to check if user is tenant or owner
		$scope.isOwner = function () {
			if ($('#test1').is(':checked')) {
				$scope.isOwner = false;
			} else if ($('#test2').is(':checked')) {
				$scope.isOwner = true;
			}
		};

		// Registers a new user and creates a new user_data object.
		$scope.register = function () {
			ref.createUser({
				// Set user with email and pw
				email: $scope.account.email,
				password: $scope.account.password
			}, function (error, userData) {
				if (error) {
					console.log(`Error creating user: ${error}`);
				} else {
					console.log(`Created user account with UID: ${userData.uid}`, userData);
					authFactory.storeUser(userData.uid, $scope.account.email, $scope.newAccount.username, $scope.isOwner);
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