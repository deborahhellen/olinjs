var path = require('path');
var mongoose = require('mongoose');

//Defining schema for ingredients
var ingredSchema = mongoose.Schema({
	name: String,
	price: Number
});

//Defining the order the kitchen gets
//The kitchen doesn't care about price, so it gets only ingredient names
var orderSchema = mongoose.Schema({
	ingredients : [String]
});

var Ingredient = mongoose.model("Ingredient", ingredSchema);

var Order = mongoose.model("Order", orderSchema);


//Shows the list of available ingredients
var ingredients = function (req, res) {
	Ingredient.find({}, function(err, ingList) {
		if (err) {
			console.error("Couldn't find ingredients", err);
		};
		res.render('ingredients', {'ingredients': ingList});
	});
};

var outOfStock = function (req, res) {
//Flags an item as out of stock 
//TODO: make this update the status to out of stock rather than just delete
	var objID = req.body.id;
	console.log(req.body);

	Ingredient.findOneAndRemove({ _id : objID}, function(err, removedItem) {
		if (err) {
			console.error("Couldn't find and remove out of stock item", err);
		};
		console.log("removed " + removedItem);
		res.send(removedItem);
	});
};

var edit = function(req, res) {
//Allows users to update the name and price of an item
	var objID = req.body.id;
	var newName = req.body.name;
	var newPrice = req.body.price;

	Ingredient.findOneAndUpdate( { _id: objID}, {name: newName, price: newPrice}, function(err, ingred, numberAffected) {
		if (err) {
			console.error("Couldn't update name and price", err);
		};
		console.log(ingred);
		res.send(ingred);
	});
};

var addIngredient = function(req, res) {
//Allows the user to add a new ingredient
	console.log(req.body);
	var newIngredient = new Ingredient({name: req.body.name, price: req.body.price});
	newIngredient.save( function(err, ingred, numberAffected) {
		if (err) {
			console.error("Couldn't save new item", err);
		};
		console.log(ingred);
		res.send(ingred);
	});

};

var newOrder = function (req, res) {
//Shows the user the blank order form with all of the available ingredients
	Ingredient.find({}, function(err, ingList) {
		if (err) {
			console.error("Couldn't find ingredients", err);
		};
		res.render('order', {'ingredients': ingList});
	});
};

var orders = function (req, res) {
	Order.find({}, function(err, orders) {
		if (err) {
			console.error("Couldn't find any orders", err);
			res.status(500).send("Couldn't find any orders");
		};
		res.render('kitchen', {'orders': orders});
	});
};

var submitOrder = function (req, res) {
	//save all of the foods that the user checked in a group

	//Get a list of the ingredients in the order
	var orderIng = JSON.parse(req.body.ingredients);
	console.log(orderIng);

	var newOrder = new Order ({ingredients: orderIng});

	newOrder.save( function(err, order) {
		if (err) {
			console.error("Couldn't save new order", err);
			res.status(500).send("Couldn't save new order");
		};
		res.send(order);
	});
};

var completedOrder = function (req, res) {
//Removes the order from the database once "completed"
	var orderId = req.body.id; 
	console.log(orderId);

	Order.findOneAndRemove({ _id : orderId}, function(err, removedItem) {
		if (err) {
			console.error("Couldn't find and remove out of stock item", err);
		};
		console.log("removed " + removedItem);
		res.send(removedItem);
	});
};


module.exports.orders = orders;
module.exports.newOrder = newOrder;
module.exports.ingredients = ingredients;
module.exports.outOfStock = outOfStock;
module.exports.edit = edit;
module.exports.addIngredient = addIngredient;
module.exports.submitOrder = submitOrder;
module.exports.completedOrder = completedOrder;
	



