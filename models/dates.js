var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// See http://mongoosejs.com/docs/schematypes.html

var todaySchema = new Schema({
	
	todayIs : Date
	
})

// export 'Set' model so we can interact with it in other files
module.exports = mongoose.model('Today', todaySchema);