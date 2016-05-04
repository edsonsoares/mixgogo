var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// See http://mongoosejs.com/docs/schematypes.html

var emailSchema = new Schema({
	
	email : String
	
})

// export 'Set' model so we can interact with it in other files
module.exports = mongoose.model('Email', emailSchema);