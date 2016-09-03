var mongoose = require('mongoose');

// create Schema
var serverSchema = mongoose.Schema({
	name : String,
    status : {type: Boolean, default: true},
    lastTimeUp : { type: Date, default: Date.now },
    uptime : Number,
    added : { type: Date, default: Date.now }
});

// add method here
/*serverSchema.methods.speak = function () {

}*/

// create model then export it
module.exports = mongoose.model('Server', serverSchema);  