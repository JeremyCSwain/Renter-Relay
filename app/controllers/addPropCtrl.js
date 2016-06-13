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

		// Radio button input to check if user is tenant or owner
		$scope.isOwner = function () {
			return user.is_owner;
		};

		// Radio button input to check if user is visitor or prev tenant
		$scope.tenantStatus = function () {
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
			let postKey;

			let tenanted = $scope.tenanted;
			let userComment = $scope.userComment;
			let newAddress = $scope.newAddress;
			let newCity = $scope.newCity;
			let newState = $scope.newState;
			let newZipCode = $scope.newZipCode;
			let cost = $scope.cost;
			let newBedroomCount = $scope.newBedroomCount;
			let newBathroomCount = $scope.newBathroomCount;
			let newSqFt = $scope.newSqFt;
			let default_image = $scope.default_image;

			return authFactory.getUser().then(UserObj => {
	      user = UserObj;
	      }
	    )
	    .then(
		    function () {
					newState = $('#state-select').val();
					$http.post(
		        `${firebaseURL}/postings.json`,
		        JSON.stringify({
		        	uid: user.uid,
		        	username: user.username,
		        	is_owner: user.is_owner,
		        	tenanted: tenanted,
		          zip_code: newZipCode,
		          cost: cost,
		          state: newState,
		          city: newCity,
		          address: newAddress,
		          room_count: newBedroomCount,
		          bath_count: newBathroomCount,
		          sqft: newSqFt,
		          main_image: default_image
		        }
		      )
		   	)}     	
      )
      .then(
      	// After posting the new listing, return back the new list of postings
      	function () {
	      	return listingFactory().then(mainPostings => {
	      		
						$scope.postings = mainPostings;
						for (var key in mainPostings) {
							$scope.postings[key].id = key;
							postKey = $scope.postings[key].id;
						}
						console.log("All main postings: ", postKey);
					},
					// Logs error if rejected.
						error => console.log("Error:", error)
					)
	      }
      )
      .then(
      	// If user leaves a comment, post the comment to the main posting
      	function () {
	      	$http.post(
	      		`${firebaseURL}/comments/${postKey}.json`,
		      	JSON.stringify({
		      		id: postKey,
		      		uid: user.uid,
		      		username: user.username,
		      		tenanted: tenanted,
		      		is_owner: user.is_owner,
		      		user_comment: $scope.userComment
		      	})
	      	)
	      }
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
      );  
		};

	// End of dependency function
	}
// End of app.controller
]);