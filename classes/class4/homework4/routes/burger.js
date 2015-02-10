var path = require('path');
var models = require('../models/models');

var routes = {};

var Ingredient = models.Ingredient;
var Order = models.Order;

//Shows the list of available ingredients
routes.ingredients = function (req, res) {
	Ingredient.find({}, function(err, ingList) {
		if (err) {
			console.error("Couldn't find ingredients", err);
			res.status(500).send("Couldn't get ingredients list");
		};
		res.render('ingredients', {'ingredients': ingList});
	});
};

routes.outOfStock = function (req, res) {
//Flags an item as out of stock 
	var objID = req.body.id;
	console.log(req.body);

	Ingredient.findOneAndUpdate({ _id : objID}, {inStock: false}, function(err, removedItem) {
		if (err) {
			console.error("Couldn't find and remove out of stock item", err);
			res.status(500).send("Coulddn't find and remove out of stock item");
		};
		console.log(removedItem + "Is out of stock");
		res.send(removedItem);
	});
};

routes.edit = function(req, res) {
// Handles updating the name and price of an item
	var objID = req.body.id;
	var newName = req.body.name;
	var newPrice = req.body.price;

	Ingredient.findOneAndUpdate( { _id: objID}, {name: newName, price: newPrice}, function(err, ingred, numberAffected) {
		if (err) {
			console.error("Couldn't update name and price", err);
			res.status(500).send("Couldn't update the ingredient");
		};
		console.log(ingred);
		res.send(ingred);
	});
};

routes.addIngredient = function(req, res) {
// Handles adding a new ingredient 

	var isInStock = true;	// When a new ingredient is added, it is in stock

	var newIngredient = new Ingredient({name: req.body.name, price: req.body.price, inStock: isInStock});
	
	newIngredient.save( function(err, ingred, numberAffected) {
		if (err) {
			console.error("Couldn't save new item", err);
			res.status(500).send("Couldn't save the new ingredient to the db");
		};
		res.send(ingred);
	});

};

routes.newOrder = function (req, res) {
// Gets the blank order form with all of the available ingredients
	Ingredient.find({}, function(err, ingList) {
		if (err) {
			console.error("Couldn't find ingredients", err);
			res.status(500).send("Couldn't find available ingredients for the order form");
		};
		res.render('order', {'ingredients': ingList});
	});
};

routes.orders = function (req, res) {
// Gets all of the pending orders
	Order.find({}, function(err, orders) {
		if (err) {
			console.error("Couldn't find any orders", err);
			res.status(500).send("Couldn't find any orders");
		};
		res.render('kitchen', {'orders': orders});
	});
};

routes.submitOrder = function (req, res) {
// Save all of the foods that the user checked in an Order

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

routes.completedOrder = function (req, res) {
//Removes the order from the database once "completed"
	var orderId = req.body.id; 
	console.log(orderId);

	Order.findOneAndRemove({ _id : orderId}, function(err, removedItem) {
		if (err) {
			console.error("Couldn't find and remove order ", err);
			res.status(500).send("Couldn't remove completed order");
		};
		console.log("removed " + removedItem);
		res.send(removedItem);
	});
};


module.exports = routes;

	



