"use strict";

app.controller("pageCtrl", [
	"$scope",
	"$http",
	"$location",
	"$filter",
	"authFactory",
	"listingFactory",
	"imageFactory",
	"commentFactory",
	"proFactory",
	"conFactory",
	"ratingFactory",
	"firebaseURL",

	function ($scope, $http, $location, $filter, authFactory, listingFactory, imageFactory, commentFactory, proFactory, conFactory, ratingFactory, firebaseURL) {

		let ref = new Firebase(firebaseURL);

		$scope.postingsArray = [];
		$scope.postings = {};
		$scope.images = {};
		$scope.comments = {};
		$scope.pros = {};
		$scope.cons = {};
		$scope.ratings = {};

		let user = {};

		authFactory.getUser().then(UserObj => {
			user = UserObj;
			}
		);

		// Check if user is tenant or owner
		$scope.isOwner = function () {
			return user.is_owner;
		};

		// Get current user object
		authFactory.getUser().then(UserObj => {
			user = UserObj;
			// Hide search bar until page loads
			$('#searchbar').hide();
			}
		)
		.then(
			function () {
			  // Invokes promise that reads posting data from Firebase, then pushes the data into the postings object if resolved.
				// Creates postings object with the unique key for id
				return listingFactory().then(mainPostings => {
					$scope.postings = mainPostings;
					for (var key in mainPostings) {
						$scope.postings[key].id = key;
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
								is_owner: addedComments[key].is_owner,
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
								is_owner: addedPros[key].is_owner,
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
								is_owner: addedCons[key].is_owner,
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
								uid: addedRatings[key].uid,
								username: addedRatings[key].username,
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
					// Preloader until load
					$('#preloader').hide();
					// Return search bar
					$('#searchbar').show();
					console.log("Final Postings Array:", $scope.postingsArray);
					console.log("Final Postings Object:", $scope.postings);
					},
					// Logs error if rejected.
					error => console.log("Error:", error)
				)
			}
		);

		// Function to activate 'photoModal' modal form.
		$scope.photoModal = function (postId) {
			let modalId = "#photoModal" + postId;
			$(modalId).openModal();
		};

		// Function to activate 'commentModal' modal form.
		$scope.commentModal = function (postId) {
			let modalId = "#commentModal" + postId;
			$(modalId).openModal();
		};

		// Function to activate 'proModal' modal form.
		$scope.proModal = function (postId) {
			let modalId = "#proModal" + postId;
			$(modalId).openModal();
		};

		// Function to activate 'conModal' modal form.
		$scope.conModal = function (postId) {
			let modalId = "#conModal" + postId;
			$(modalId).openModal();
		};

		// Function to activate 'carouselModal'.
		$scope.carouselModal = function (postId) {
			let modalId = "#carouselModal" + postId;
			$(modalId).openModal();
		};

		// Sets rating for selected posting, then sends rating data to firebase.
		$scope.rateFunction = function (rating, postId) {
			$http.post(
				`${firebaseURL}/ratings/${postId}.json`,
				JSON.stringify({
					uid: user.uid,
					username: user.username,
					user_rating: rating
				})
			)
			.then(
          // Handle resolve
        () => console.log("Successfully added rating info to post on firebase."),
          // Handle reject
        (response) => console.log(response)  
      )
		};

		// Jquery for scrolling windows of user content on each card
		$(".list-wrapper").scrollTop(10000);

		$('input').css('visibility', 'visible');

  // End dependency function
	}
// End of app.controller
]);
















