var mongoose = require("mongoose");

//Defining schema for ingredients
var ingredSchema = mongoose.Schema({
	name: String,
	price: Number,
	inStock: Boolean
});

//Defining the order the kitchen gets
//The kitchen doesn't care about price, so it gets only ingredient names
var orderSchema = mongoose.Schema({
	ingredients : [String]
});

var Ingredient = mongoose.model("Ingredient", ingredSchema);

var Order = mongoose.model("Order", orderSchema);

module.exports.Ingredient = Ingredient;
module.exports.Order = Order;