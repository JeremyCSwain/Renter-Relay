"use strict";

// Gets posting images data from Firebase
app.factory("imageFactory", ($q, $http) =>
	() =>
		$q((resolve, reject) => 
			$http.get(`https://renter-relay.firebaseio.com/posting_images.json`)
				.success(
					mainImages => resolve(mainImages),
					error => reject(error)
				)
		)
);