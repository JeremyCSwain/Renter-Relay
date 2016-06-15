"use strict";

app.controller("userCtrl", [
	"$scope",
	"$http",
	"$location",
	"authFactory",
	"listingFactory",
	"imageFactory",
	"commentFactory",
	"proFactory",
	"conFactory",
	"ratingFactory",
	"firebaseURL",

	function ($scope, $http, $location, authFactory, listingFactory, imageFactory, commentFactory, proFactory, conFactory, ratingFactory, firebaseURL) {

		let ref = new Firebase(firebaseURL);

		$scope.postingsArray = [];
		$scope.postings = {};
		$scope.images = {};
		$scope.comments = {};
		$scope.pros = {};
		$scope.cons = {};
		$scope.ratings = {};

		let user = {};

		// Get current user object
		authFactory.getUser().then(UserObj => {
			user = UserObj;
			// Hide header and collection until page loads
			$('#userheader').hide();
			$('#user_collection').hide();
			}
		)
		.then(
			function () {
			  // Invokes promise that reads posting data from Firebase, then pushes the data into the postings object if resolved.
				// Creates postings object with the unique key for id
				return listingFactory().then(mainPostings => {
					for (var key in mainPostings) {
						// Select postings that only the current user has added.
						if (mainPostings[key].uid == user.uid) {
							$scope.postings = mainPostings;
							$scope.postings[key].id = key;
						}
					}
					// console.log("All main postings: ", $scope.postings);
				},
				// Logs error if rejected.
					error => console.log("Error:", error)
				)
			}
		)
		.then(
			// Invokes promise to pull in images, then adds the images properties to the posting object.
			function () {
				return imageFactory().then(mainImages => {
					$scope.images = mainImages;
					let addedImages = {};
					let postKey = {};
					for (postKey in $scope.postings) {
						addedImages = $scope.images[postKey];
						if (addedImages == null || addedImages == "") {
							$scope.postings[postKey].images = 
								{
									image: null
								}
						} else {
							$scope.postings[postKey].images = addedImages;
						}
						for (var key in addedImages) {
							$scope.postings[postKey].images[key] = {
								id: key,
								uid: addedImages[key].uid,
								username: addedImages[key].username,
								image: addedImages[key].image
							};
						}
					}
					
					},
					// Logs error if rejected.
					error => console.log("Error:", error)
				)
			}
		)
		.then(
			// Invokes promise to pull in comments, then adds the comments properties to the posting object.
			function () {
				return commentFactory().then(mainComments => {
					$scope.comments = mainComments;
					let addedComments = {};
					let postKey = {};
					for (postKey in $scope.postings) {
						addedComments = $scope.comments[postKey];
						$scope.postings[postKey].comments = addedComments;
						for (var key in addedComments) {
							$scope.postings[postKey].comments[key] = {
								id: key,
								uid: addedComments[key].uid,
								username: addedComments[key].username,
								tenanted: addedComments[key].tenanted,
								is_owner: addedComments[key].is_owner,
								user_comment: addedComments[key].user_comment
							};
						}
					}
					// Preloader until load
					$('#preloader').hide();
					// Show on load
					$('#userheader').show();
					$('#user_collection').show();
					},
					// Logs error if rejected.
					error => console.log("Error:", error)
				)
			}
		);

		$scope.deleteListing = function (postId) {
      $http.delete(
      	`${firebaseURL}/postings/${postId}.json`
			)
      .then(
        // Return the user to the main page of postings
      	function () {
	      	$location.path('#/user-account');
	      }
      )
      .then(
        // Handle resolve
        () => console.log("Successfully deleted listing from firebase"),
					// Handle reject
        (response) => console.log(response)  
      ); 
    };

    $scope.deletePhoto = function (postId, imageId) {
      $http.delete(
      	`${firebaseURL}/posting_images/${postId}/${imageId}.json`
			)
      .then(
        // Return the user to the main page of postings
      	function () {
	      	$location.path('#/user-account');
	      }
      )
      .then(
        // Handle resolve
        () => console.log("Successfully deleted photo from firebase"),
					// Handle reject
        (response) => console.log(response)  
      );  
    };

    $scope.deleteComment = function (postId, commentId) { 	
      $http.delete(
      	`${firebaseURL}/comments/${postId}/${commentId}.json`
			)
      .then(
        // Return the user to the main page of postings
      	function () {
	      	$location.path('#/user-account');
	      }
      )
      .then(
        // Handle resolve
        () => console.log("Successfully deleted comment from firebase"),
					// Handle reject
        (response) => console.log(response)  
      );  
    };

    // Function to activate 'photoEditModal'.
		$scope.photoEditModal = function (postId) {
			let modalId = "#photoEditModal" + postId;
			$(modalId).openModal();
		};

		// Function to activate 'commentEditModal'.
		$scope.commentEditModal = function (postId) {
			let modalId = "#commentEditModal" + postId;
			$(modalId).openModal();
		};

  // End dependency function
	}
// End of app.controller
]);



















