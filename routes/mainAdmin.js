const express = require("express");
const router = express.Router();
const mainAdminModel = require("../models/mainAdminModel");
const User = require("../models/userModel");
const HostAdmin = require("../models/hostAdminModel");
const hostAdminCreator = require("../controller/hostAdminCreateController");

const { adminValidator } = require("../middleware/inputConstraints");

router.get("/showAllUsers", async (req, res, next) => {
  if (req.user && req.user.role == "mainAdmin") {
    const user = await User.find();
    console.log(user);
    if (!user) {
      return res.status(404).send("no users");
    }
    // res.status(200).send({ data: user })
    return res.render("all-users", { user });
  } else if (req.user && req.user.role == "admin") {
    return res.redirect("/dashboard");
  }
  res.redirect("/");
});

router.get("/showHospitalAdmin", async (req, res, next) => {
  if (req.user && req.user.role == "mainAdmin") {
    const hostAdmin = await HostAdmin.find();
    console.log(hostAdmin);
    if (!hostAdmin) {
      return res.status(404).send("no hostAdmins");
    }
    res.render("admins", {
      hostAdmin,
      layout: false,
    });
    return; // added return statement
  } else if (req.user && req.user.role == "admin") {
    res.redirect("/dashboard");
    return; // added return statement
  }
  res.redirect("/");
});

router.post("/deleteHospitalAdmin/:id", async (req, res, next) => {
  if (req.user && req.user.role == "mainAdmin") {
    const id = req.params.id;
    const hostAdmin = await HostAdmin.findByIdAndDelete({ _id: id });
    console.log(hostAdmin);
    if (!hostAdmin) {
      return res.status(404).send("no hostAdmins");
    }
    return res.status(200).redirect("/mainAdmin/showHospitalAdmin");
  } else if (req.user && req.user.role == "admin") {
    return res.redirect("/dashboard");
  }
  return res.redirect("/");
});

router.get("/addNewHospitalAdmin", (req, res) => {
  if (req.user && req.user.role == "mainAdmin") {
    res.status(200).render("createAdmin", { layout: false });
    return; // added return statement
  } else if (req.user && req.user.role == "admin") {
    res.redirect("/dashboard");
    return; // added return stateme
  }
  res.redirect("/");
});
router.post("/addNewHospitalAdmin", adminValidator, hostAdminCreator);

module.exports = router;
