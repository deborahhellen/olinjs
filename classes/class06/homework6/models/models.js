var mongoose = require('mongoose');

var twotSchema = mongoose.Schema({
	text: String,
	date: Date,
	_author: {type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

var userSchema = mongoose.Schema({
	username: String, 
	oauthID: Number,
	password: String,
	created: Date,
	twots: [{type: mongoose.Schema.Types.ObjectId, ref: 'Twot'}]
});

var Twot = mongoose.model('Twot', twotSchema);
var User = mongoose.model('User', userSchema);

module.exports.Twot = Twot;
module.exports.User = User;
