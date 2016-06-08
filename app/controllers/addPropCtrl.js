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
		$scope.tenanted = false;
		$scope.userComment = "";
		$scope.newAddress = "";
		$scope.newCity = "";
		$scope.newState = "";
		$scope.newZipCode = "";
		$scope.newBedroomCount;
		$scope.newBathroomCount;
		$scope.newSqFt;
		$scope.default_image = "./images/puzzle-house.jpg";

		let user = {};
		
		// Get current user object
		authFactory.getUser().then(UserObj => {
      user = UserObj;
      }
    );

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
			$scope.newState = $('#state-select').val();
			$http.post(
        `${firebaseURL}/postings.json`,
	        JSON.stringify({
	        	uid: user.uid,
	        	userName: user.userName,
	        	tenanted: $scope.tenanted,
	          zip_code: $scope.newZipCode,
	          state: $scope.newState,
	          city: $scope.newCity,
	          address: $scope.newAddress,
	          room_count: $scope.BedroomCount,
	          bath_count: $scope.newBathroomCount,
	          sqft: $scope.newSqFt,
	          main_image: $scope.default_image
	        })
      )
      .then(
      	// After posting the new listing, return back the new list of postings
      	function () {
	      	return listingFactory().then(mainPostings => {
						$scope.postings = mainPostings;
						for (var key in mainPostings) {
							$scope.postings[key].id = key;
						}
						$scope.lastPostingKey = $scope.postings[key].id;
						// console.log("All main postings: ", $scope.postings[key].id);
					},
					// Logs error if rejected.
						error => console.log("Error:", error)
					)
	      }
      )
      .then(
      	// If user leaves a comment, post the comment to the main posting
      	function () {
	      	$http.post(`${firebaseURL}/comments/${$scope.lastPostingKey}.json`,
		      	JSON.stringify({
		      		uid: user.uid,
		      		userName: user.userName,
		      		tenanted: $scope.tenanted,
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

	// End of dependancy function
	}
// End of app.controller
]);