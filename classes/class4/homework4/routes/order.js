var mongoose = require("mongoose");

var newOrder = function (req, res) {
	Ingredient.find({}, function(err, ingList) {
		if (err) {
			console.error("Couldn't find ingredients", err);
		};
		res.render('ingredients', {'ingredients': ingList});
	});
	res.render('order', {'ingredients': ingList});
};

module.exports.newOrder = newOrder;