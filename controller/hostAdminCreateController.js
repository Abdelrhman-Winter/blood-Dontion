const { validationResult } = require("express-validator");
const HostAdmin = require("../models/hostAdminModel");

function hostAdminCreator(req, res) {
  const { adminname, password, hospitalName } = req.body;
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
    res.render("createAdmin", {
      adminname,
      password,
      hospitalName,
      error_msg: req.flash("error_msg"),
      layout: false,
    });
  } else {
    const newHostAdmin = new HostAdmin({
      adminname,
      password,
      hospitalName,
    });

    //Creat new HostAdmin
    newHostAdmin
      .save()
      .then(() => {
        req.flash("success_msg", "You Created a New HostAdmin");

        console.log("You are now signed and can sign In");
        res.redirect("/mainAdmin/addNewHospitalAdmin");
      })
      .catch((err) => {
        console.log(err);
        req.flash("error_msg", `something going wrong "${err}"`);
        console.log(`something going wrong "${err}"`);
      });
  }
}
module.exports = hostAdminCreator;
