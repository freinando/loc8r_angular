var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

module.exports.reviewsCreate = async function (req, res) { 
	var locationid = req.params.locationid;
	if (!locationid) {
		return sendJsonResponse(res, 404, {"message": "Not found, locationid required"});
	}else{
		try{
			var location = await Loc.findById(locationid).select('rating reviews').exec();
			if(!location){
				return sendJsonResponse(res, 404, {"message": "locationid not found"});
			}
			location.reviews.push({
				author: req.body.author,
				rating: req.body.rating,
				reviewText: req.body.reviewText
		    });
			var totalRatings = 0;
		    for(review of location.reviews){
		    	totalRatings += review.rating;
		    }
		    location.rating = totalRatings / location.reviews.length;
		    var locationPlusReview = await location.save();
			var thisReview = locationPlusReview.reviews[locationPlusReview.reviews.length - 1];
			sendJsonResponse(res, 201, thisReview);
		}catch(error){
			return sendJsonResponse(res, 400, error);
		}

	}
};

module.exports.reviewsReadOne = async function (req, res) { 
	if (!req.params.locationid || !req.params.reviewid) {
		return sendJsonResponse(res, 404, {"message": "Not found, locationid and reviewid are both required"});
	}
	try{
		var location = await Loc.findById(req.params.locationid).select('name reviews').exec();
		if(!location) sendJsonResponse(res, 404, {"message": "locationid not found"});
		else {
			if(location.reviews && location.reviews.length > 0){
				var review = location.reviews.id(req.params.reviewid);
				if(!review) sendJsonResponse(res, 404, {"message": "reviewid not found"});
				else sendJsonResponse(res, 200, review);
			}
			else sendJsonResponse(res, 404, {"message": "No reviews found for this location"});
		}
	}catch(error){
		sendJsonResponse(res, 404, error);
	}
};

module.exports.reviewsUpdateOne = async function (req, res) { 
	
	try{if (!req.params.locationid || !req.params.reviewid) {
		return sendJsonResponse(res, 404, {"message": "Not found, locationid and reviewid are both required"});
	}
		var location = await Loc.findById(req.params.locationid).select('rating reviews').exec();
		if (!location) {
			return sendJsonResponse(res, 404, {"message": "locationid not found"});
		}
		if (location.reviews && location.reviews.length > 0) {

			var thisReview = await location.reviews.id(req.params.reviewid);
  			if (!thisReview) {
				return sendJsonResponse(res, 404, {"message": "reviewid not found"});
			}
			thisReview.author = req.body.author;
			thisReview.rating = req.body.rating;
			thisReview.reviewText = req.body.reviewText;

			var totalRatings = 0;
		    for(review of location.reviews){
		    	totalRatings += review.rating;
		    }
		    location.rating = totalRatings / location.reviews.length;

			var newRevPlusLocation = await location.save();
        	return sendJsonResponse(res, 200, thisReview);

		}else {
			return sendJsonResponse(res, 404, {"message": "No review to update"});
		}
	}
	catch(error){
		return sendJsonResponse(res, 404, error);
	}
};

module.exports.reviewsDeleteOne = async function (req, res) { 
	if (!req.params.locationid || !req.params.reviewid) {
		return sendJsonResponse(res, 404, {"message": "Not found, locationid and reviewid are both required"});
	}
	try{
		var location = await Loc.findById(req.params.locationid).select('rating reviews').exec();
		if(!location){
			return sendJsonResponse(res, 404, {"message": "locationid not found"});
		}
		if (location.reviews && location.reviews.length > 0) {
			var reviewToDelete = await location.reviews.id(req.params.reviewid);
			if(!reviewToDelete){
				return sendJsonResponse(res, 404, {"message": "reviewid not found"});
			}

			location.reviews.id(req.params.reviewid).remove();
			console.log(location.reviews);
			if(location.reviews.length === 0){
				location.rating = 0;
			}else{
				var totalRatings = 0;
			    for(review of location.reviews){
			    	totalRatings += review.rating;
			    }
			    location.rating = totalRatings / location.reviews.length;
			}
			await location.save();
			sendJsonResponse(res, 204, null);

		}else{
			return sendJsonResponse(res, 404, {"message": "No review to delete"});
		}
	}catch(error){
		return sendJsonResponse(res, 404, error);
	}

};
