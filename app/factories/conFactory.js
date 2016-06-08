"use strict";

// Gets 'con' comparison data from Firebase
app.factory("conFactory", ($q, $http) =>
	() =>
		$q((resolve, reject) => 
			$http.get("https://renter-relay.firebaseio.com/posting_cons.json")
				.success(
					mainCons => resolve(mainCons),
					error => reject(error)
				)
		)
);