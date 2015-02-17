var models = require('../models/models');

var User = models.User;
var Twot = models.Twot;

var home = function (req, res) {
/* Displays all of the current twots and users */

	console.dir(req.cookies);
	console.dir(req.session);

	var message;
	//Get current logged in user
	if (req.session.userName) {
		message = req.session.userName;
	} else {
		message = false;
	};

	//Get all twots in db
	Twot.find({}).sort({date: -1}).exec(function (err, twots) {
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
};

var newTwot = function (req, res) {
/* Add a new twot to the db */

	var twotText = req.body.twot;
	var date = new Date();
	var message;

	//Get current logged in user
	if (req.session.userName) {
		//If user is logged in, create new twot
		console.log("making new twot with text: " + twotText);
		var twot = new Twot({text: twotText, date: date, _author: req.session.userId});
		twot.save( function(err, savedTwot) {
			if (err) {
				console.error("Can't save the twot", err);
				res.status(500).send("Can't save the twot");
			} else {
				res.send(savedTwot);
			};
		});
	} else {
		//If user isn't logged in, direct them to login page
		message = "You must be logged in to add a twot";
		res.send(message);
	};
};

var deleteTwot = function (req, res) {
/* Remove a twot from the db */

	var id = req.body._id;
	var authId = req.body._author;
	var sessionId = req.session.userId;
	console.log("auth id: " + authId);
	console.log("sessio id: " + sessionId);

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



