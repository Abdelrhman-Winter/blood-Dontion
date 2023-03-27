const Contact = require("../models/contact");
const { validationResult } = require("express-validator");

// Handle contact form submission
const handleContactFormSubmission = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // If there are validation errors, flash error messages and redirect to the contact form
    const errorMessages = errors.array().map((error) => error.msg);
    req.flash("error_msg", errorMessages);
    return res.redirect("/contact");
  }

  // If there are no validation errors, create a new contact
  const { name, email, message, subject } = req.body;
  const contact = new Contact({ name, email, message, subject });
  await contact.save();

  // Flash success message and redirect to the homepage
  req.flash(
    "success_msg",
    "Thank you for contacting us! We will get back to you soon."
  );
  res.redirect("/users/contact");
};
const handleContactFormHome = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // If there are validation errors, flash error messages and redirect to the contact form
    const errorMessages = errors.array().map((error) => error.msg);
    req.flash("error_msg", errorMessages);
    return res.redirect("/");
  }

  // If there are no validation errors, create a new contact
  const { name, email, message, subject } = req.body;
  const contact = new Contact({ name, email, message, subject });
  await contact.save();

  // Flash success message and redirect to the homepage
  req.flash(
    "success_msg",
    "Thank you for contacting us! We will get back to you soon."
  );
  res.redirect("/");
};
module.exports = { handleContactFormSubmission, handleContactFormHome };
