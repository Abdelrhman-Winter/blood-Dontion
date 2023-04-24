const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../middleware/auth");
const { handleContactFormHome } = require("../controller/contactController");
const { contactValidator } = require("../middleware/inputConstraints");
const User = require("../models/userModel");
const HostAdmin = require("../models/hostAdminModel");
//welcom page
function isAdmin(req) {
  console.log(req.isAuthenticated() && req.user instanceof HostAdmin);
  return req.isAuthenticated() && req.user instanceof HostAdmin;
}
router.get("/dashboard", (req, res) => {
  if (isAdmin(req)) {
    res.render("dashboard");
  } else {
    res.redirect("/");
  }
});
// Redirect user based on their role
router.get("/", (req, res) => {
  if (isAdmin(req)) {
    res.redirect("/dashboard");
  } else {
    res.render("index");
  }
}); // //dashboard
// router.get("/index", ensureAuthenticated, (req, res) => {
//   res.render("dashboard");
// });
router.post("/", contactValidator, handleContactFormHome);

module.exports = router;
