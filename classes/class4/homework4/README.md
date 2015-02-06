Homework 4
===

The files for homework assignment 4 in the Spring 2015 offering of OlinJs.

This is a node app which uses express and MongoDB. More information about express can be found [here](http://expressjs.com/).
Database querying is handled through the npm package [Mongoose](http://mongoosejs.com/index.html). Templating is handled using the npm package [express-handlebars](https://www.npmjs.com/package/express-handlebars?__hstc=72727564.2e86e593b68c07efb454467c29b8489c.1422031174821.1422645902824.1423252000356.3&__hssc=72727564.2.1423252000356&__hsfp=3925223714). 

The three main pages:
1. ```\ingredients``` which displays a list of available burger ingredients and their prices and allows the user to add new ingredients, edit existing ones, or mark ingredients as "out of stock."
2. ```\order``` which displays an order form that allows the customer to submit a burger order from the list of availabe ingredients.
3. ```\kitchen``` which displays a list of pending orders and allows the user to mark an order as completed.
