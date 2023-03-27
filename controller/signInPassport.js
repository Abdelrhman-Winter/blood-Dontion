const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

//Load User model
const User = require("../models/userModel");

//Sign in using passport localStrategy
module.exports = (passport) => {
  passport.use(
    new localStrategy({ usernameField: "email" }, (email, password, done) => {
      //Match User
      User.findByEmail(email)
        .then((user) => {
          if (!user) {
            return done(null, false, {
              message: "That user is not registered ",
            });
          }

          //match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;

            if (isMatch) {
              console.log(user);

              return done(null, user);
            } else {
              return done(null, false, { message: "password incorrect" });
            }
          });
        })
        .catch((err) => console.log(err));
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then((user) => {
        done(null, user);
      })
      .catch((err) => {
        done(err, null);
      });
  });
};
