"use strict";

app.controller("addPropCtrl", [
	"$scope", 
	"$location",
	"$http",
	"firebaseURL",
	"Upload",
	"listingFactory",
	"authFactory",

	function ($scope, $location, $http, firebaseURL, Upload, listingFactory, authFactory) {

		$(document).ready(function() {
		  $('select').material_select();
		});

		$scope.postings = {};
		$scope.lastPostingKey = "";
		$scope.tenanted;
		$scope.userComment = "";
		$scope.newAddress = "";
		$scope.newCity = "";
		$scope.newState = "";
		$scope.newZipCode = "";
		$scope.cost = "";
		$scope.newBedroomCount;
		$scope.newBathroomCount;
		$scope.newSqFt;
		$scope.default_image = "./images/puzzlehouse.jpg";

		let user = {};

		authFactory.getUser().then(UserObj => {
			user = UserObj;
			}
		);

		// Check if user is tenant or owner
		$scope.isOwner = function () {
			return user.is_owner;
		};

		// Radio button input to check if user is visitor or prev tenant
		$scope.tenantStatus = function (postId) {
			if ($('#test1').is(':checked')) {
				$scope.tenanted = true;
			} else if ($('#test2').is(':checked')) {
				$scope.tenanted = false;
			}
		};

		// Sets the user's file upload into a variable before posting to database
		$scope.setImages = function (files) {
			Upload.base64DataUrl(files).then(
				function (base64URLs) {
					$scope.default_image = base64URLs[0];
					console.log("Images successfully stored");
				}
			)
		};

		// Adds a new base posting to firebase.
		$scope.addNewListing = function () {

			return authFactory.getUser().then(UserObj => {
	      user = UserObj;
	      }
	    )
	    .then(
		    function (resolve, reject) {
					$scope.newState = $('#state-select').val();
					$http.post(
		        `${firebaseURL}/postings.json`,
		        JSON.stringify({
		        	uid: user.uid,
		        	username: user.username,
		        	is_owner: user.is_owner,
		        	tenanted: $scope.tenanted,
		          zip_code: $scope.newZipCode,
		          cost: $scope.cost,
		          state: $scope.newState,
		          city: $scope.newCity,
		          address: $scope.newAddress,
		          room_count: $scope.newBedroomCount,
		          bath_count: $scope.newBathroomCount,
		          sqft: $scope.newSqFt,
		          main_image: $scope.default_image,
		          main_comment: $scope.userComment
		        }
		      )
		   	)}     	
      )
      .then(
      	// Return the user to the main page of postings
      	function () {
	      	$location.path('#/main');
	      }
      )
      .then(
        // Handle resolve
        () => console.log("Successfully added new posting to firebase"),
					// Handle reject
        (response) => console.log(response)  
      )
		};

	// End of dependency function
	}
// End of app.controller
]);