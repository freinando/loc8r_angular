	
(function {
	angular
	.module('loc8rApp')
	.controller('homeCtrl', homeCtrl);

	homeCtrl.$inject = ['$scope', 'http', 'geolocation'];
	function homeCtrl ($scope, $http, geolocation) {
		var vm = this;
		vm.pageHeader = {
			title: 'Loc8r',
			strapline: 'Find places to work with wifi near you!'
		};
		vm.sidebar = {
			content: "Looking for wifi and a seat etc etc erere"
		};
		vm.message = "Checking your location";
		
		vm.getData = function (position) {
			vm.message = "Searching for nearby places...";
			var lat = position.coords.latitude, lng = position.coords.longitude;

			loc8rData($http, function(data){
					var locs = data.data;
					vm.message = locs.length > 0 ? "" : "No locations found";
					vm.data = { locations: locs };
				}, function(e){
					console.log(e);
					vm.message = "Sorry, something's gone wrong ";
			}).locationByCoords(lat, lng);
		}

		vm.showError = function (error) {
	  		$scope.$apply(function() {
	    		vm.message = error.message;
	  		});
		};

		vm.noGeo = function () {
	  		$scope.$apply(function() {
				vm.message = "Geolocation not supported by this browser.";
	  		});
		};
		geolocation.getPosition(vm.getData,vm.showError,vm.noGeo);
	}

})();