var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// See http://mongoosejs.com/docs/schematypes.html

var setSchema = new Schema({
	
	title: String,
	lineup: {
		artist: [String],
		soundcloudUrl: [String]
	},
	description: String,
	isfree: {type: Boolean, default: false},
	minPrice: String,
	maxPrice: String,
	buyUrl: String,
	artcover: String,
	dateAdded : { type: Date, default: Date.now },
	dateEvent: Date,
	startTime: String,
	endTime: String,
	address: String,
	zip: Number,
	city: String
})






// Trying to make artists an array


// var setSchema = new Schema({
	
// 	title: String,
// 	artists: [{name: String, url: String}],
// 	soundcloudUrls: [String],
// 	description: String,
// 	isfree: {type: Boolean, default: false},
// 	minPrice: String,
// 	maxPrice: String,
// 	buyUrl: String,
// 	artcover: String,
// 	dateAdded : { type: Date, default: Date.now },
// 	dateEvent: Date,
// 	startTime: String,
// 	endTime: String,
// 	address: String,
// 	zip: Number,
// 	city: String


// })

// export 'Set' model so we can interact with it in other files
module.exports = mongoose.model('Set',setSchema);