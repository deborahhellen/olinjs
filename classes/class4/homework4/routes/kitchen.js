var mongoose = require('mongoose');

var orders = function (req, res) {
	Orders.find({}, function(err, orders) {
		if (err) {
			console.error("Couldn't find any orders", err);
			res.status(500).send("Couldn't find any orders");
		};
		res.render('kitchen', {'orders': orders});
	});
};


module.exports.orders = orders;