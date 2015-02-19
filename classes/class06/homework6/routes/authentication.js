// config

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');

var config = require('../oauth.js');
var models = require('../models/models');

var User = models.User;

var isValidPassword = function(user, password){
  return bCrypt.compareSync(password, user.password);
};

var createHash = function(password){
 return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

var facebookStrat = passport.use(new FacebookStrategy({
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
		    username: profile.displayName,
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
));


var localSignin = passport.use('local-signin', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) { 
    // check in mongo if a user with username exists or not
    User.findOne({ 'username' :  username }, function(err, user) {
        // In case of any error, return using the done method
        if (err)
          console.error("Couldn't log in", err);
        // Username does not exist, log error & redirect back
        if (!user){
          console.log('User Not Found with username '+username);
          return done(null, false);                 
        };
        // User exists but wrong password, log the error 
        if (!isValidPassword(user, password)){
          console.log('Invalid password');
          return done(null, false);
        };
        // User and password both match, return user from 
        // done method which will be treated like success
        return done(null, user);
    }
    );
}));

var localSignup = passport.use('signup', new LocalStrategy({
    passReqToCallback : true
  },
  function(req, username, password, done) {
      // find a user in Mongo with provided username
      User.findOne({'username':username},function(err, user) {
        // In case of any error return
        if (err){
          console.log('Error in SignUp: '+err);
          return done(err);
        }
        // already exists
        if (user) {
          console.log('User already exists');
          res.send('user already exists!');
        } else {
          // if there is no user with that email
          // create the user
          var newUser = new User();
          // set the user's local credentials
          newUser.username = username;
          newUser.password = createHash(password);;
 
          // save the user
          newUser.save(function(err) {
            if (err){
              console.log('Error in Saving user: '+err);  
              throw err;  
            }
            console.log('User Registration succesful');    
            return done(null, newUser);
          });
        }
      });

}));

module.exports.facebookStrat = facebookStrat;
module.exports.localSignin = localSignin;
module.exports.localSignup = localSignup;	



