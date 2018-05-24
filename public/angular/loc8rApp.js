angular.module('loc8rApp', []);


var _isNumeric = function (n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
};

//need to return a fucntion that does the processing in order ot work as a filter
var formatDistance = function () {
	return function (distance) {
		var numDistance, unit;
		if (distance && _isNumeric(distance)) {
			if (distance > 1000) {
				numDistance = parseFloat(distance / 1000).toFixed(1);
				unit = 'km';
			} else {
				numDistance = parseInt(distance * 1,10);
				unit = 'm';
			}
		return numDistance + unit;
		} else {
			return "?";
		}
	};
};

//directive to create the stars, name of function in camel case
var ratingStars = function () {
	return {
		scope: {
			thisRating : '=rating'
		},
		templateUrl: '/angular/rating-stars.html'
	};
};


var loc8rData = function ($http, successCallback, errorCallback) {
	var locationByCoords = function (lat, lng) {
    	return $http.get('/api/locations?lng=' + lng + '&lat=' + lat + '&maxDistance=20').then(successCallback, errorCallback);
    };
    return {
    	locationByCoords : locationByCoords
	};
};

var locationListCtrl = function ($scope, $http, geolocation) {
	$scope.message = "Checking your location";

	$scope.getData = function (position) {
		$scope.message = "Searching for nearby places...";
		var lat = position.coords.latitude, lng = position.coords.longitude;

		loc8rData($http, function(data){
				var locs = data.data;
				$scope.message = locs.length > 0 ? "" : "No locations found";
				$scope.data = { locations: locs };
			}, function(e){
				console.log(e);
				$scope.message = "Sorry, something's gone wrong ";
		}).locationByCoords(lat, lng);
	}

	$scope.showError = function (error) {
  		$scope.$apply(function() {
    		$scope.message = error.message;
  		});
	};

	$scope.noGeo = function () {
  		$scope.$apply(function() {
			$scope.message = "Geolocation not supported by this browser.";
  		});
	};
	geolocation.getPosition($scope.getData,$scope.showError,$scope.noGeo);
};

var geolocation = function () {
	var getPosition = function (cbSuccess, cbError, cbNoGeo) {
		if (navigator.geolocation) {
			//browser to ask for allow location
			navigator.geolocation.getCurrentPosition(cbSuccess, cbError);
		} else {
			cbNoGeo(); 
		}
	}; 
	return {
		getPosition : getPosition
	};
};

angular.module('loc8rApp')
		.controller('locationListCtrl', locationListCtrl)
		.filter('formatDistance', formatDistance)
		.directive('ratingStars', ratingStars)
		.service('loc8rData', loc8rData)
		.service('geolocation', geolocation);


