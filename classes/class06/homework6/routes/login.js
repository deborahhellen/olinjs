var models = require('../models/models');

var User = models.User;
var Twot = models.Twot;

var login = function (req, res) {
	res.render('login');
};

var signup = function (req, res) {
	var newUser = new User ({username: req.body.username, password: req.body.password});

	console.log('signing up user');

	newUser.save(function(err, user) {
		if (err) {
			console.error("Couldn't sign up the new user", err);
			res.status(500).send("Oops, couldn't save the new user");
		} else {
			res.send(user);
		};
	});
};

/*var addUser = function (req, res) {
	var newUser = new User({name: req.body.name});

	console.log("adding user");
	if (req.session.userName) {
		message = "You're already logged in, " + req.session.userName;
	} else { 
		message = "Hello welcome to the site new user!";
		req.session.userName = req.body.name;
	}

	newUser.save(function (err, user) {
		if (err) {
			console.error("Couldn't save new user", err);
			res.status(500).send("Oops, couldn't save the new user");
		} else {
			req.session.userId = user._id;
			res.send(user);
		};
	});
};

var logout = function(req, res) {
	console.log("Logging out");
	if (req.session.userName) {
		message = "Successfully logged out!";
		req.session.destroy();
	} else {
		message = "You aren't logged in!";
	}
	res.send(".");

}*/

module.exports.login = login;