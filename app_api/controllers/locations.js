var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};


var theEarth = (function(){
	var earthRadius = 6371; // km, miles is 3959
	var getDistanceFromRads = function(rads) {
		return parseFloat(rads * earthRadius);
	};
  	var getRadsFromDistance = function(distance) {
    	return parseFloat(distance / earthRadius);
	};
  	return {
	    getDistanceFromRads : getDistanceFromRads,
	    getRadsFromDistance : getRadsFromDistance
	}; 
})();


module.exports.locationsCreate = async function (req, res) { 
	try{
		var newLocation = await Loc.create({
		    								name: req.body.name,
											address: req.body.address,
		    								facilities: req.body.facilities.split(","),
		    								coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
										    openingTimes:[{
							    				days: req.body.days1,
								  				opening: req.body.opening1,
								  				closing: req.body.closing1,
								  				closed: req.body.closed1,
							  				}, {								  					
											  	days: req.body.days2,
											  	opening: req.body.opening2,
											  	closing: req.body.closing2,
										      	closed: req.body.closed2,
										    }]
										});
		sendJsonResponse(res, 201, newLocation);
	}catch(error){
		sendJsonResponse(res, 400, error);
	}
};

module.exports.locationsListByDistance = async function (req, res) { 
	var lng = parseFloat(req.query.lng);
	if(!lng && lng !==0) return sendJsonResponse(res, 404, {"message" : "Longitude parameter missing"});
  	var lat = parseFloat(req.query.lat);
  	if(!lat && lat!==0) return sendJsonResponse(res, 404, {"message" : "Latitude parameter missing"});

  	var maxDistance = parseFloat(req.query.maxDistance) * 1000;
  	if(!maxDistance)maxDistance = 20000;

  	var point = {
  		type: "Point",
    	coordinates: [lng, lat]
  	};

  	var geoOptions = {
    	spherical: true,
    	maxDistance: theEarth.getRadsFromDistance(maxDistance),
    	num: 10
	};

	try{
		var results = await Loc.aggregate(
			        [
			            {
			                $geoNear: {
			                    near: point,
			                    spherical: true,
			                    distanceField: "distance",
			                    num: 10,
			                    maxDistance: maxDistance
			                }
			            },
			            {
			        		$project: {
						         distance: true,
						         name: true,
						         address: true,
						         rating: true,
						         facilities: true
			            	}
			        	}
			        ]
        );
        sendJsonResponse(res, 200, results);
	}
  	catch(error){
  		sendJsonResponse(res, 404, error);
  	}
};

module.exports.locationsReadOne = async function (req, res) { 
	if (!req.params.locationid) {
		return sendJsonResponse(res, 404, {"message": "Not found, locationid is required"});
	}
	try{
		var location = await Loc.findById(req.params.locationid).exec();
		if (!location) sendJsonResponse(res, 404, {"message": "locationid not found"});
		else sendJsonResponse(res, 200, location);
	}catch(error){
		sendJsonResponse(res, 404, error);
	}
};

module.exports.locationsUpdateOne = async function (req, res) { 
	if (!req.params.locationid) {
		return sendJsonResponse(res, 404, {"message": "Not found, locationid is required"});
	}
	try{
		var location = await Loc.findById(req.params.locationid).select('-reviews -rating').exec();
		if(!location) {
			return sendJsonResponse(res, 404, {"message": "locationid not found"});
		}
		location.name = req.body.name;
   		location.address = req.body.address;
   		location.facilities = req.body.facilities.split(",");
   		location.coords = [parseFloat(req.body.lng),parseFloat(req.body.lat)];
   		location.openingTimes = [{
				days: req.body.days1,
				opening: req.body.opening1,
				closing: req.body.closing1,
				closed: req.body.closed1,
			}, {
				days: req.body.days2,
				opening: req.body.opening2,
				closing: req.body.closing2,
				closed: req.body.closed2,
			}
		];
		var savedLocation = await location.save();
		sendJsonResponse(res, 200, savedLocation);

	}catch(error){
		sendJsonResponse(res, 400, error);
	}
};

module.exports.locationsDeleteOne = async function (req, res) { 
	var locationid = req.params.locationid;
  	if (!locationid) {
		return sendJsonResponse(res, 404, {"message": "No locationid"});
	}
	try{
		var location = await Loc.findById(locationid).exec();
		if(!location){
			return sendJsonResponse(res, 404, {"message": "locationid not found"});
		}
		await Loc.findByIdAndRemove(locationid).exec();
		sendJsonResponse(res, 204, null);
	}catch(error){
		return sendJsonResponse(res, 404, error);
	}
};