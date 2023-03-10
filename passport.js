const passport = require("passport");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
const User = require('./models/user')

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) { return done(err) }
      if (!user) { return done(null, false) }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          // passwords match! log user in
          return done(null, user)
        } else {
          // passwords do not match!
          return done(null, false)
        }
      })
    });
  })
);
passport.serializeUser(function(user, done) { done(null, user.id) });

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) { done(err, user) });
});

module.exports = passport