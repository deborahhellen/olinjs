var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var session = require('express-session');
var mongoose = require('mongoose');

var index = require('./routes/index');
var login = require('./routes/login');

var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
}));

app.get('/', index.home);

app.get('/login', login.login);

app.post('/addUser', login.addUser);

app.post('/logout', login.logout);

app.post('/newTwot', index.newTwot);

app.post('/deleteTwot', index.deleteTwot);

app.post('/userTwots', index.userTwots);

mongoURI = process.env.MONGOURI || "mongodb://localhost/twat";
mongoose.connect(mongoURI);

var PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
  console.log("Application running on port:", PORT);
});


