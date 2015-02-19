var models = require('../models/models');
var passport = require('passport');

var User = models.User;
var Twot = models.Twot;

var home = function (req, res) {
/* Displays all of the current twots and users */
	
	console.dir(req.cookies);
	console.dir(req.session);
	var passportId = req.session.passport.user;

	var message;
	//Get current logged in user
	if (req.session.passport.user) {
		message = req.user.username;
	//Get all twots in db if user is logged in
		Twot.find({}).populate('_author').sort({date: -1}).exec(function (err, twots) {
			if (err) {
				console.error("Couldn't find the twots!", err);
				res.status(500).send("Oops, couldn't find any twots!");
			} else {
				User.find({}, function (err, users) {
					if (err) {
						console.error("couldn't find users");
						res.status(500).send("Oops, couldn't find any users");
					} else {
						res.render('home', {'message': message, 'twots': twots, 'users': users});
					};
				}); 
			};
		});
	} else {
		message = false;
		res.render('home', {'message': message});
	};
};

var newTwot = function (req, res) {
/* Add a new twot to the db */

	//Get current logged in user
	if (req.user) {
		var twotText = req.body.twot;
		var date = new Date();
		var message;
		var authorId = req.user._id;
		//If user is logged in, create new twot
		console.log("making new twot with text: " + twotText);
		var twot = new Twot({text: twotText, date: date, _author: authorId});
		twot.save( function(err, savedTwot) {
			if (err) {
				console.error("Can't save the twot", err);
				res.status(500).send("Can't save the twot");
			} else {
				console.log(savedTwot._id);
				Twot.findOne({_id: savedTwot._id}).populate('_author').exec(function(err, t) {
					if (err) {
						res.status(500).send("Cant populate");
					};
					console.log(t);
					res.send(t);
				});
			};
		});
	} else {
		//If user isn't logged in, direct them to login page
		message = "You must be logged in to add a twot";
		console.log(message);
		res.send(message);
	};
};

var deleteTwot = function (req, res) {
/* Remove a twot from the db */
	var id = req.body._id;
	var authId = req.body._author;

	if (req.user) {
		var sessionId = req.user._id.toString();

		if (authId === sessionId) {
			Twot.findOneAndRemove({_id: id}, function (err, removedTwot) {
				if (err) {
					console.error("Couldn't remove the twot!");
					res.status(500).send("Couldn't remove the twot!");
				} else {
					res.send(removedTwot);
				};
			});
		} else {
			res.send("Can't delete someone else's twot!");
		};
	}	else {
		res.send('Must be logged in to delete a twot!');
	};
};

var userTwots = function (req, res) {
/* Highlighs all of the twots by that user*/
	var userId = req.body.userId;

	Twot.find({_author: userId }).exec(function (err, twots) {
		if (err) {
			console.error("Couldn't find user with matching id ", err);
			res.status(500).send("Couldn't get that user");
		} else {
			console.log(twots);
			res.send(twots);
		};
	});
};


module.exports.userTwots = userTwots;
module.exports.home = home;
module.exports.newTwot = newTwot;
module.exports.deleteTwot = deleteTwot;



