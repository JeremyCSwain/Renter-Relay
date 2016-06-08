"use strict";

app.directive('starRating',

	function() {
		return {
			// Set icons for stars
			restrict : 'A',
			template : '<ul id="star-ratings-ul" class="rating col s4">'
			  + '<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">'
			  + '<i class="material-icons small">star_rating</i>'
			  + '</li>'
			  + '</ul>',
			scope : {
			ratingValue : '=',
			max : '=',
			onRatingSelected : '&'
			},
			// Updates 'stars' value by filling the star icons
			link : function(scope, elem, attrs) {
				let updateStars = function() {
				  scope.stars = [];
				  for ( var i = 0; i < scope.max; i++) {
				  	scope.stars.push({
				   		filled : i < scope.ratingValue
				  	});
				  }
				};
			 	// Sets rating based on user value clicked
				scope.toggle = function(index) {
				  scope.ratingValue = index + 1;
				  scope.onRatingSelected({
				  	rating : index + 1
					});
				};
				
				// Watch the rating value and update 'stars'
				scope.$watch('ratingValue',
				  function(oldVal, newVal) {
				  	if (newVal) {
				    	updateStars();
				  	}
				  }
				);
			}
		};
	}
);





