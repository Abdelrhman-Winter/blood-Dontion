const { validationResult } = require("express-validator");
const User = require("../models/userModel");

function registerHadling(req, res) {
  const {
    firstName,
    lastName,
    email,
    password,
    passwordConfirmation,
    phone,
    nationalID,
    city,
    address,
    birthDay,
    birthMonth,
    birthYear,
    bloodType,
  } = req.body;
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
      `Please check the following fields:
      ${errorMessageString}`
    );
    //Send content with errors
    res.render("signUp", {
      firstName,
      lastName,
      email,
      password,
      passwordConfirmation,
      phone,
      nationalID,
      city,
      address,
      birthDay,
      birthMonth,
      birthYear,
      bloodType,
      error_msg: req.flash("error_msg"),
      layout: false,
    });
  } else {
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      nationalID,
      city,
      address,
      birthDay,
      birthMonth,
      birthYear,
      bloodType,
    });

    //Creat new user
    newUser
      .save()
      .then(() => {
        req.flash("success_msg", "You are now signed and can sign In");
        // res.status(200).json({
        //   timetemp: Date.now(),
        //   msg: "You are now registered and can login",
        //   code: 200,
        // });
        console.log("You are now signed and can sign In");
        res.redirect("/users/signIn");
      })
      .catch((err) => {
        console.log(err);
        req.flash(`something going wrong "${err}"`);
        console.log(`something going wrong "${err}"`);
      });
  }
}
module.exports = registerHadling;
