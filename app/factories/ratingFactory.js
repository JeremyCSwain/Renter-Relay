"use strict";

// Gets ratings data from Firebase
app.factory("ratingFactory", ($q, $http) =>
	() =>
		$q((resolve, reject) => 
			$http.get(`https://renter-relay.firebaseio.com/ratings.json`)
				.success(
					mainRatings => resolve(mainRatings),
					error => reject(error)
				)
		)
);