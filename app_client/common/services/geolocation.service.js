(function {

	angular
	.module('loc8rApp')
	.service('geolocation', geolocation);

	function geolocation() {
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

})();