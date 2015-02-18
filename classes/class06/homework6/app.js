var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var session = require('express-session');
var mongoose = require('mongoose');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

var index = require('./routes/index');
var login = require('./routes/login');
var config = require('./oauth.js');
var models = require('./models/models');
var auth = require('./routes/authentication.js');

var User = models.User;
var Twot = models.Twot;

/*// config
passport.use(new FacebookStrategy({
clientID: config.facebook.clientID,
clientSecret: config.facebook.clientSecret,
callbackURL: config.facebook.callbackURL
},
function(accessToken, refreshToken, profile, done) {
	User.findOne({ oauthID: profile.id }, function(err, user) {
		if(err) { console.log(err); }
		if (!err && user != null) {
		  done(null, user);
		} else {
		  var user = new User({
		    oauthID: profile.id,
		    name: profile.displayName,
		    created: Date.now()
		  });
		  user.save(function(err) {
		    if(err) {
		      console.log(err);
		    } else {
		      console.log("saving user ...");
		      done(null, user);
		    };
		  });
		};
	});
}
));	*/

// serialize and deserialize
passport.serializeUser(function(user, done) {
 console.log('serializeUser: ' + user._id)
 done(null, user._id);
});
passport.deserializeUser(function(id, done) {
 User.findById(id, function(err, user){
     console.log(user)
     if(!err) done(null, user);
     else done(err, null)
 })
});

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
app.use(passport.initialize());
app.use(passport.session());

app.get('/', index.home);

app.get('/login', login.login);

app.post('/newTwot', index.newTwot);

app.post('/deleteTwot', index.deleteTwot);

app.post('/userTwots', index.userTwots);

/*app.get('/account', ensureAuthenticated, function(req, res){
User.findById(req.session.passport.user, function(err, user) {
 if(err) {
   console.log(err);
 } else {
   res.send(user.name);
 };
});
});*/

app.get('/auth/facebook',
passport.authenticate('facebook'),
function(req, res){
});
app.get('/auth/facebook/callback',
passport.authenticate('facebook', { failureRedirect: '/login' }),
function(req, res) {
 res.redirect('/');
});

mongoURI = process.env.MONGOURI || "mongodb://localhost/twat";
mongoose.connect(mongoURI);

var PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
  console.log("Application running on port:", PORT);
});

app.get('/logout', function(req, res){
req.logout();
res.redirect('/');
});

