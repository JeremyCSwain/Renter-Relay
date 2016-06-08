"use strict";

// Gets comments data from Firebase
app.factory("commentFactory", ($q, $http) =>
	() =>
		$q((resolve, reject) => 
			$http.get(`https://renter-relay.firebaseio.com/comments.json`)
				.success(
					mainComments => resolve(mainComments),
					error => reject(error)
				)
		)
);