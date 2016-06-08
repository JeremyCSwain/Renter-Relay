"use strict";

// Gets 'pro' comparison data from Firebase
app.factory("proFactory", ($q, $http) =>
	() =>
		$q((resolve, reject) => 
			$http.get("https://renter-relay.firebaseio.com/posting_pros.json")
				.success(
					mainPros => resolve(mainPros),
					error => reject(error)
				)
		)
);