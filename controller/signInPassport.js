const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

//Load User model
const User = require("../models/userModel");
const HostAdmin = require("../models/hostAdminModel");
const MainAdmin = require("../models/mainAdminModel");

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
            // Check MainAdmin model
            MainAdmin.findOne({ adminname: email }).then((mainAdmin) => {
              if (mainAdmin) {
                // Match password
                bcrypt.compare(password, mainAdmin.password, (err, isMatch) => {
                  if (err) throw err;

                  if (isMatch) {
                    console.log(mainAdmin);
                    return done(null, mainAdmin);
                  } else {
                    return done(null, false, {
                      message: "Password incorrect",
                    });
                  }
                });
              } else {
                // Check HostAdmin model
                HostAdmin.findByAdminname(email)
                  .then((admin) => {
                    if (admin) {
                      // Match password
                      bcrypt.compare(
                        password,
                        admin.password,
                        (err, isMatch) => {
                          if (err) throw err;

                          if (isMatch) {
                            console.log(admin);
                            return done(null, admin);
                          } else {
                            return done(null, false, {
                              message: "Password incorrect",
                            });
                          }
                        }
                      );
                    } else {
                      return done(null, false, { message: "User not found" });
                    }
                  })
                  .catch((err) => console.log(err));
              }
            });
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
          // Check MainAdmin model
          MainAdmin.findById(id)
            .then((mainAdmin) => {
              if (mainAdmin) {
                done(null, mainAdmin);
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
        }
      })
      .catch((err) => {
        done(err, null);
      });
  });
};
