const router = require("express").Router();
const passport = require("passport");

const CreatandSendRestLink = require("../controller/CreatandSendRestLink");
const verifyEmail = require("../middleware/verifyEmailReset");
const reset = require("../controller/resetController");
const profilEditor = require("../controller/profileEdit");
const path = require("path");
const User = require("../models/userModel");
const HostAdmin = require("../models/hostAdminModel");
const {
  signupValidator,
  EditingValidator,
  passwordValidator,
  contactValidator,
  bookingValidator,
  adminValidator,
  sanitizeName,
  sanitizeEmail,
  sanitizePassword,
} = require("../middleware/inputConstraints");
const registerHadling = require("../controller/singUpValidation");
const {
  handleContactFormSubmission,
  handleContactFormHome,
} = require("../controller/contactController");
const {
  handleBookingFormSubmission,
  handleBookingConfirmation,
} = require("../controller/bookingController");
const { ensureAuthenticated } = require("../middleware/auth");
const adminCreationTest = require("../controller/adminTest");
//Login page

router.get("/signIn", (req, res) => {
  if (req.isAuthenticated()) {
    console.log(req.isAuthenticated());

    // User is already authenticated, redirect to dashboard
    return res.redirect("/");
  }
  res.render("signIn");
});

// router.get("/login", (req, res) => {
//   if (req.isAuthenticated()) {
//     console.log(req.isAuthenticated());

//     // User is already authenticated, redirect to
//     return res.redirect("/");
//   }
//   res.render("Login");
// });

//Register page
router.get("/signUp", (req, res) => res.render("SignUp", { layout: false }));

//forgot page
router.get("/forgot", (req, res) => {
  if (req.isAuthenticated()) {
    console.log(req.isAuthenticated());

    // User is already authenticated, redirect to
    return res.redirect("/");
  }
  res.render("forgot");
});

//Reset page
router.get("/reset/:id/:token", verifyEmail);

//profile page
router.get("/profile", ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    console.log(user);
    if (!user) {
      console.log("usernot found");
    } else {
      res.render("profile", { user: req.user, name: req.user.name });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server error");
  }
});
//update page
router.get("/profileEdit", ensureAuthenticated, (req, res) => {
  res.render("profileEdit", { user: req.user });
});

//contact page
router.get("/contact", (req, res) => res.render("contact"));

//booking page
router.get("/booking", ensureAuthenticated, (req, res) =>
  res.render("booking")
);

//bookingConfirmation page
router.get(
  "/bookingConfirmation",
  ensureAuthenticated,
  handleBookingConfirmation
);

//AboutUs page
router.get("/aboutUs", (req, res) => res.render("aboutUs"));

//AboutUs page
router.get("/services", (req, res) => res.render("services"));

//AboutUs page
router.get("/servicesDetails", (req, res) => res.render("servicesDetails"));

//admin test
router.get("/admin", (req, res) => res.render("admin"));

//Register handle   =======================================

router.post(
  "/signUp",
  signupValidator,
  sanitizeName,
  sanitizeEmail,
  sanitizePassword,
  registerHadling
);

//login handle  =======================================
router.post("/signIn", (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log(req.isAuthenticated());

    // User is already authenticated, redirect to
    return res.redirect("/");
  }
  console.log(req.isAuthenticated() && req.user instanceof HostAdmin);
  // User is not authenticated, use passport to authenticate
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/signIn",
    failureFlash: true,
  })(req, res, next);
});

// Check if authenticated user is an instance of HostAdmin model
function isAdmin(req) {
  console.log(req.isAuthenticated() && req.user instanceof HostAdmin);
  return req.isAuthenticated() && req.user instanceof HostAdmin;
}

// // Redirect user based on their role
// router.get("/", (req, res) => {
//   if (isAdmin(req)) {
//     res.redirect("/dashboard");
//   } else {
//     res.render("index");
//   }
// });

// router.post("/login", (req, res, next) => {
//   if (req.isAuthenticated()) {
//     console.log(req.isAuthenticated());

//     // User is already authenticated, redirect to
//     return res.redirect("/");
//   }
//   console.log(req.isAuthenticated());
//   // User is not authenticated, use passport to authenticate
//   passport.authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "/users/login",
//     failureFlash: true,
//   })(req, res, next);
// });

// logout handle =======================================
router.get("/logout", (req, res, next) => {
  // Logout

  req.logout((err) => {
    if (err) {
      return next(err);
    } else {
      req.flash("success_msg", "You are logged out");
      // req.session.destroy();
      res.redirect("/users/signIn");
    }
  });
});

//forgot handle ========================================

router.post("/forgot", CreatandSendRestLink);

// reset handel========================================

router.post("/reset/:id/:token", passwordValidator, sanitizePassword, reset);

// dash handel========================================

router.post("/", (req, res) => {
  User.findByIdAndUpdate(
    req.user.id,
    { file: req.file.filename },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Internal server error");
      }
      console.log(updatedUser);
      res.redirect("/");
    }
  );
});
//profile handle ========================================

router.post("/profileEdit", EditingValidator, sanitizeName, profilEditor);
//change password handle ========================================

router.post("/changePassword", CreatandSendRestLink);

// Handle submission of contact form ========================================
router.post("/contact", contactValidator, handleContactFormSubmission);

// Handle booking ========================================

router.post("/booking", bookingValidator, handleBookingFormSubmission);

// Handle admin test ========================================
router.post("/admin", adminValidator, adminCreationTest);

module.exports = router;
