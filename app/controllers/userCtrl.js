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
								uid: addedComments[key].uid,
								username: addedComments[key].username,
								tenanted: addedComments[key].tenanted,
								user_comment: addedComments[key].user_comment
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
			// Invokes promise to pull in pro comparison, then adds the pro comparison properties to the posting object.
			function () {
				return proFactory().then(mainPros => {
					$scope.pros = mainPros;
					let addedPros = {};
					let postKey = {};
					for (postKey in $scope.postings) {
						addedPros = $scope.pros[postKey];
						$scope.postings[postKey].posting_pros = addedPros;
						for (var key in addedPros) {
							$scope.postings[postKey].posting_pros[key] = {
								uid: addedPros[key].uid,
								username: addedPros[key].username,
								tenanted: addedPros[key].tenanted,
								pro1: addedPros[key].pro1,
								pro2: addedPros[key].pro2,
								pro3: addedPros[key].pro3,
								pro4: addedPros[key].pro4,
								pro5: addedPros[key].pro5,
								pro6: addedPros[key].pro6
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
			// Invokes promise to pull in con comparison, then adds the con comparison properties to the posting object.
			function () {
				return conFactory().then(mainCons => {
					$scope.cons = mainCons;
					let addedCons = {};
					let postKey = {};
					for (postKey in $scope.postings) {
						addedCons = $scope.cons[postKey];
						$scope.postings[postKey].posting_cons = addedCons;
						for (var key in addedCons) {
							$scope.postings[postKey].posting_cons[key] = {
								uid: addedCons[key].uid,
								username: addedCons[key].username,
								tenanted: addedCons[key].tenanted,
								con1: addedCons[key].con1,
								con2: addedCons[key].con2,
								con3: addedCons[key].con3,
								con4: addedCons[key].con4,
								con5: addedCons[key].con5,
								con6: addedCons[key].con6
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
			// Invokes promise to pull in ratings, then adds the ratings properties to the posting object.
			function () {
				return ratingFactory().then(mainRatings => {
					$scope.ratings = mainRatings;
					let addedRatings = {};
					let postKey = {};
					let count = 0;
					let avgRating;

					for (postKey in $scope.postings) {
						addedRatings = $scope.ratings[postKey];
						$scope.postings[postKey].ratings = addedRatings;
						$scope.postings[postKey].avg_rating = 0;
						$scope.postings[postKey].num_of_ratings = 0;
						for (var key in addedRatings) {
							$scope.postings[postKey].ratings[key] = {
								user_rating: addedRatings[key].user_rating
							};
							// Get the sum of each post's ratings and count how many total ratings there are.
							$scope.postings[postKey].num_of_ratings = $scope.postings[postKey].num_of_ratings + 1;
							$scope.postings[postKey].avg_rating += parseInt($scope.postings[postKey].ratings[key].user_rating);
						};
						// Divide the total sum of the post's ratings and divide by the num of ratings to get the true average for each post.
						avgRating = parseFloat($scope.postings[postKey].avg_rating / $scope.postings[postKey].num_of_ratings);
						avgRating = Math.round( avgRating * 10 ) / 10;
						$scope.postings[postKey].avg_rating = avgRating;
						if (isNaN($scope.postings[postKey].avg_rating)) {
							$scope.postings[postKey].avg_rating = 0;
						}
					};
					
					// Allow for use of a main postings array and object of objects **Angular only allows filtering with arrays
					for (var p in $scope.postings) {
						$scope.postingsArray.push($scope.postings[p]);
					};

					console.log("Final Postings Array:", $scope.postingsArray);
					console.log("Final Postings Object:", $scope.postings);
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



















