const express = require("express");
const router = express.Router();
const { ensureAuthenticated } = require("../middleware/auth");
const { handleContactFormHome } = require("../controller/contactController");
const { contactValidator } = require("../middleware/inputConstraints");
//welcom page
router.get("/", (req, res) => res.render("index"));
// //dashboard
// router.get("/index", ensureAuthenticated, (req, res) => {
//   res.render("dashboard");
// });
router.post("/", contactValidator, handleContactFormHome);

module.exports = router;
