"use strict";

// Gets postings data from Firebase
app.factory("listingFactory", ($q, $http) =>
	() =>
		$q((resolve, reject) => 
			$http.get("https://renter-relay.firebaseio.com/postings.json")
				.success(
					mainPostings => resolve(mainPostings),
					error => reject(error)
				)
		)
);