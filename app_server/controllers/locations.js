var request = require('request-promise');

var apiOptions = {
	server : "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
	apiOptions.server = "https://getting-mean-loc8r.herokuapp.com";
}

/* GET 'home' page */
module.exports.homelist = async function(req, res){
	renderHomepage(req, res);
};


/* GET 'Location info' page */
module.exports.locationInfo = function(req, res){
	getLocationInfo(req, res, function(req, res, responseData) {
		renderDetailPage(req, res, responseData);
  	});
};


/* GET 'Add review' page */
module.exports.addReview = function(req, res){
	getLocationInfo(req, res, function(req, res, responseData) {
		renderReviewForm(req, res, responseData);
	});
};


module.exports.doAddReview = async function(req, res){
	var requestOptions, path, locationid, postdata;
	locationid = req.params.locationid;
	path = "/api/locations/" + locationid + '/reviews';
	postdata = {
		author: req.body.name,
		rating: parseInt(req.body.rating, 10),
		reviewText: req.body.review
	};

	if (!postdata.author || !postdata.rating || !postdata.reviewText) {
  		return res.redirect('/location/' + locationid + '/review/new?err=val');
	}
	requestOptions = {
		url : apiOptions.server + path,
		method : "POST",
		json : postdata,
		resolveWithFullResponse: true,
	};
	try{
		var response = await request(requestOptions);
		if (response.statusCode === 201) {
        	res.redirect('/location/' + locationid);
      	}else if (response.statusCode === 400 && response.body.name && response.body.name === "ValidationError" ) {
			res.redirect('/location/' + locationid + '/review/new?err=val');
		}
      	else{
      		_showError(req, res, response.statusCode);
      	}
	}
	catch(error) {
		if (error.statusCode === 400 && error.response.body.name && error.response.body.name === "ValidationError" ) {
			res.redirect('/location/' + locationid + '/review/new?err=val');
		}
      	else{
      		_showError(req, res, error.statusCode);
      	}
	}
};



var renderHomepage = function(req, res){
	res.render('locations-list', {
		title: 'Loc8r - find a place to work with wifi',
		pageHeader:{
			title:'Loc8r',
			strapline: 'Find places to work with wifi near you!' 
		},
		sidebar: "Looking for wifi and a seat? Loc8r helps you find places to "+
					"work when out and about. Perhaps with coffee, cake or a pint? "+
					"Let Loc8r help you find the place you're looking for."
	});
};


var renderDetailPage = function (req, res, locDetail) {
	res.render('location-info', {
				title: locDetail.name,
				pageHeader: {title: locDetail.name},
				sidebar: {
					context: 'is on Loc8r because it has accessible wifi and space to sit '+
						'down with your laptop and get some work done.',
					callToAction: 'If you\'ve been and you like it - or if you don\'t - ' +
						'please leave a review to help other people just like you.'
				},
				location: locDetail
	});
};


var renderReviewForm = function (req, res, location) {
	res.render('location-review-form', {
		title: 'Review '+location.name+' on Loc8r',
		pageHeader: { title: 'Review '+location.name },
		error: req.query.err,
		url: req.originalUrl
	});
};


//error page
var _showError = function (req, res, status) {
	var title, content;
	if (status === 404) {
		title = "404, page not found";
		content = "Oh dear. Looks like we can't find this page. Sorry.";
	} else {
		title = status + ", something's gone wrong";
		content = "Something, somewhere, has gone just a little bit wrong.";
	}
	res.status(status);
	res.render('generic-text', {
		title : title,
		content : content
	});
};


var getLocationInfo = async function (req, res, callback) {
	var requestOptions, path;
	path = "/api/locations/" + req.params.locationid;
	requestOptions = {
		url : apiOptions.server + path,
		method : "GET",
		json : {},
		resolveWithFullResponse: true,
	}; 

	try{
		var response = await request(requestOptions);
		if(response.statusCode!==200){
			return _showError(req, res, response.statusCode);
		}
		var data = response.body;
		data.coords = {
			lng : response.body.coords[0],
			lat : response.body.coords[1]
		};
		callback(req, res, data);
	}
	catch(error) {
		_showError(req, res, error.statusCode);
	}
};