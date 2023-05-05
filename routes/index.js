const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../middleware/auth");
const { handleContactFormHome } = require("../controller/contactController");
const { contactValidator } = require("../middleware/inputConstraints");
const User = require("../models/userModel");
const HostAdmin = require("../models/hostAdminModel");
const mainAdminModel = require("../models/mainAdminModel");
//welcom page
function isAdmin(req) {
  return req.isAuthenticated() && req.user instanceof HostAdmin;
}
function mainAdmin(req) {
  return req.isAuthenticated() && req.user instanceof mainAdminModel;
}
router.get("/dashboard", (req, res) => {
  if (mainAdmin(req)) {
    res.render("dashboard");
  } else {
    res.redirect("/");
  }
});

// Redirect user based on their role
router.get("/", (req, res) => {
  if (isAdmin(req)) {
    res.redirect("/hostAdmins/getUsers");
  } else if (mainAdmin(req)) {
    res.redirect("/mainAdmin/showHospitalAdmin");
  } else {
    res.render("index");
  }
}); // //dashboard
// router.get("/index", ensureAuthenticated, (req, res) => {
//   res.render("dashboard");
// });
router.post("/", contactValidator, handleContactFormHome);

module.exports = router;
