(function () {

	angular
	.module('loc8rApp')
	.directive('ratingStars', ratingStars);

	function ratingStars () {
		var x =  {
			restrict: 'EA',
			scope: {
				thisRating : '=rating'
			},
			templateUrl: '/common/directives/ratingStars/ratingStars.template.html'
		};
		return x;
	}

})();