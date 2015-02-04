var mongoose = require('mongoose');

var orders = function (req, res) {
	res.render('kitchen');
};

module.exports.orders = orders;