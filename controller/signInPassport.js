const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

//Load User model
const User = require("../models/userModel");
const HostAdmin = require("../models/hostAdminModel");

// Sign in using passport localStrategy
module.exports = (passport) => {
  passport.use(
    new localStrategy({ usernameField: "email" }, (email, password, done) => {
      // Check User model
      User.findByEmail(email)
        .then((user) => {
          if (user) {
            // Match password
            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) throw err;

              if (isMatch) {
                console.log(user);

                return done(null, user);
              } else {
                return done(null, false, { message: "Password incorrect" });
              }
            });
          } else {
            // Check HostAdmin model
            console.log(HostAdmin.findByAdminname(email));
            HostAdmin.findByAdminname(email)
              .then((admin) => {
                if (admin) {
                  // Match password
                  bcrypt.compare(password, admin.password, (err, isMatch) => {
                    if (err) throw err;

                    if (isMatch) {
                      console.log(admin);

                      return done(null, admin);
                    } else {
                      return done(null, false, {
                        message: "Password incorrect",
                      });
                    }
                  });
                } else {
                  return done(null, false, { message: "User not found" });
                }
              })
              .catch((err) => console.log(err));
          }
        })
        .catch((err) => console.log(err));
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    // Check User model
    User.findById(id)
      .then((user) => {
        if (user) {
          done(null, user);
        } else {
          // Check HostAdmin model
          HostAdmin.findById(id)
            .then((admin) => {
              done(null, admin);
            })
            .catch((err) => {
              done(err, null);
            });
        }
      })
      .catch((err) => {
        done(err, null);
      });
  });
};
