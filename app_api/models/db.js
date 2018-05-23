var mongoose = require( 'mongoose' );
require('./locations');

var dbURI = 'mongodb://ws172751/web_test';

if (process.env.NODE_ENV === 'production') {
	dbURI = process.env.MONGOLAB_URI;
}
mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error',function (err) {
  console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
});