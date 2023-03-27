const jwt = require("jsonwebtoken");

//User model
const User = require("../models/userModel");

const reset = async (req, res) => {
  const { id, token } = req.params;
  const { password, passwordConfirmation } = req.body;
  const jwt_Secret = process.env.JWT_SECRET;
  const { validationResult } = require("express-validator");
  //cheack user id
  const user = await User.findById({ _id: id });
  if (!user) {
    req.flash("error_msg", "Invalid id....");
    res.redirect("/users/forgot");
    return;
  }
  const secret = jwt_Secret + user.password;
  try {
    const payload = jwt.verify(token, secret);

    let errors = {};
    const validation = validationResult(req);
    if (!validation.isEmpty()) {
      const errorMessages = validation.array();

      errorMessages.forEach((error) => {
        //Display the first error of every field
        if (!errors[error.param]) {
          errors[error.param] = error.msg;
        }
      });

      // Concatenate the error messages
      const errorMessageString = Object.values(errors);

      // Add the error message string to the flash message
      req.flash(
        "error_msg",
        `Please check the following fields:${errorMessageString}`
      );
      //Send content with errors
      res.render("reset", {
        errors,
        password,
        passwordConfirmation,
        email: user.email,
        error_msg: req.flash("error_msg"),
      });
    } else {
      //Set password to new password
      user.password = password;

      //save user
      user
        .save()
        .then((user) => {
          req.flash(
            "success_msg",
            "You are now reset the password and can login"
          );
          res.redirect("/users/signIn");
        })
        .catch((err) => {
          console.log(err);
          req.flash("error_msg", `something going wrong "${err}"`);
        });
    }
  } catch (error) {
    console.log(error.massage);
    res.send(error.massage);
  }
};
module.exports = reset;
