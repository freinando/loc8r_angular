(function {

	angular
	.module('loc8rApp')
	.service('loc8rData', loc8rData);

	loc8rData.$inject = ['$http'];
	function loc8rData ($http, successCallback, errorCallback) {
		var locationByCoords = function (lat, lng) {
	    	return $http.get('/api/locations?lng=' + lng + '&lat=' + lat + '&maxDistance=20').then(successCallback, errorCallback);
	    };
	    return {
	    	locationByCoords : locationByCoords
		};
	};

})();