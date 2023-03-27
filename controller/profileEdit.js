const User = require("../models/userModel");

// Route handler function for updating user profile
const profilEditor = async (req, res) => {
  const { validationResult } = require("express-validator");

  try {
    // Retrieve user data from request body
    const {
      firstName,
      lastName,
      bloodType,
      city,
      address,
      phone,
      nationalID,
      email,
    } = req.body;
    const user = req.user;
    // Get user ID from session
    const userID = req.session.passport.user;
    if (!userID) {
      console.log(req.session.passport.user);
      req.flash("error_msg", "Invalid id....");
      res.redirect("/users/profile");
      return;
    }

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
      res.render("profileEdit", {
        user,
        email,
        firstName,
        lastName,
        bloodType,
        city,
        address,
        phone,
        nationalID,
        error_msg: req.flash("error_msg"),
      });
    } else {
      // Update user profile in database
      await User.findByIdAndUpdate(userID, {
        firstName,
        lastName,
        bloodType,
        city,
        address,
        phone,
        nationalID,
      });
      // Find the user in the database
      // Find the user in the database
      const userAfterUpdate = await User.findById(userID);

      // Render the profile page with the updated user data
      req.flash("success_msg", "Profile updated successfully.");
      res.redirect("/users/profile");
    }
    // Update user profile in database
  } catch (error) {
    console.log(req.body);
    res.send(error);
  }
};
module.exports = profilEditor;
