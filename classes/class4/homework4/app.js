var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var mongoose = require('mongoose');

var index = require('./routes/index');
var burger = require('./routes/burger');
var kitchen = require('./routes/kitchen');

var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', index.home);

app.get('/ingredients', burger.ingredients);

app.get('/kitchen', burger.orders);

app.get('/order', burger.newOrder);

app.post('/outOfStock', burger.outOfStock);

app.post('/edit', burger.edit);

app.post('/addIngredient', burger.addIngredient);

app.post('/submitOrder', burger.submitOrder);

app.post('/completed', burger.completedOrder);


mongoURI = process.env.MONGOURI || "mongodb://localhost/ingredients";
mongoose.connect(mongoURI);

app.listen(3000);