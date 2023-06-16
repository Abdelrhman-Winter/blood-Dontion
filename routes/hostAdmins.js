const express = require("express");
const router = express.Router();
const hostAdminModel = require("../models/hostAdminModel");
const BookingModel = require("../models/bookingModel");
const userModel = require("../models/userModel");
const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator");

// @desc get user hospital by admin hospital
router.get("/getUsers", async (req, res, next) => {
  if (req.user && req.user.role == "admin" && req.isAuthenticated()) {
    req.query = req.user.hospitalName;

    const user = await BookingModel.find({
      location: req.query,
      requests: true,
    }).populate({
      path: "user",
      select:
        "firstName lastName phone city bloodType address requests donateId",
    });

    const num_bags = await BookingModel.find({
      location: req.user.hospitalName,
      requests: true,
    });

    const userRequest = await BookingModel.find({
      location: req.query,
      isConfirmed: true,
      requests: false,
    });

    if (!user) {
      res.status(404).redirect("/");
    }
    res.render("donors-admin", {
      user,
      num_donors: user.length,
      num_bags: num_bags.length,
      num_req: userRequest.length,
      layout: false,
    });
  } else {
    res.redirect("/");
  }
});

// @desc get requests hospital by admin hospital
router.get("/request-admin", async (req, res, next) => {
  if (req.user && req.user.role == "admin" && req.isAuthenticated()) {
    req.query = req.user.hospitalName;

    const user = await BookingModel.find({
      location: req.query,
      isConfirmed: true,
      requests: false,
    }).populate({
      path: "user",
      select: "firstName lastName phone city bloodType email address requests ",
    });


    const num_bags = await BookingModel.find({
      location: req.user.hospitalName,
      requests: true,
    });

    const num_donors = await BookingModel.find({
      location: req.query,
      requests: true,
    });
    if (!user) {
      res.send("no users");
    }
    res.render("request-admin", {
      user,
      num_req: user.length,
      num_donors: num_donors.length,
      layout: false,
      num_bags: num_bags.length,
    });
  } else {
    res.redirect("/");
  }
});

// @desc reject requests hospital by admin hospital
router.post("/request-admin", async (req, res, next) => {
  if (req.user && req.user.role == "admin" && req.isAuthenticated()) {
    const id = req.body.id;
    const rejBtn = req.body.rejBtn;
    console.log('bodyyy' + req.body.idUser);
    if (req.body.email) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });
      const message = {
        from: "winter",
        to: req.body.email,
        subject: "Booking Accept",
        html: req.body.msg,
      };
      transporter.sendMail(message, async (error, info) => {
        if (error) {
          console.log(
            `Error occurred while sending email to ${req.body.email}: `,
            error
          );
        } else {
          console.log(`Email sent to ${req.body.email}: `, info.response);
          const user = await BookingModel.findOneAndUpdate({ _id: req.body.idUser }, { requests: true });
          console.log("useris " + user)
          return res.redirect("/hostAdmins/request-admin");
          /////////////////////////////////////
        }
      });
    } else if (rejBtn) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });
      const user = await BookingModel.findOne(id).populate({
        path: "user",
        select: "email",
      });
      // Send an email to the user notifying them that their booking has been deleted
      const message = {
        from: "winter",
        to: user.user.email,
        subject: "Booking deletion",
        html: `
            Hi Your Request is Rejected Please Call Hospital
        `,
      };
      transporter.sendMail(message, async (error, info) => {
        if (error) {
          console.log(
            `Error occurred while sending email to ${user.user.email}: `,
            error
          );
        } else {
          console.log(`Email sent to ${user.user.email}: `, info.response);
          /////////////////////////////////////
        }
      });
      const data = await BookingModel.findByIdAndRemove(rejBtn);
      if (!data) {
        console.log("err");
      }
      res.redirect("/hostAdmins/request-admin");
    } else {
      res.redirect("/hostAdmins/request-admin");
    }
  } else {
    res.redirect("/");
  }
});

router.get("/profile", async (req, res, next) => {
  if (req.user && req.user.role == "admin" && req.isAuthenticated()) {
    res.render("profile-admin", { layout: false, user: req.user });
  } else {
    res.redirect("/");
  }
});

router.get("/bags", async (req, res, next) => {
  if (req.user && req.user.role == "admin" && req.isAuthenticated()) {
    // bags
    const user = await BookingModel.find({
      location: req.user.hospitalName,
      requests: true,
    }).populate({ path: "user", select: "bloodType" });

    const userRequest = await BookingModel.find({
      location: req.user.hospitalName,
      isConfirmed: true,
      requests: false,
    });

    res.render("blood-bags-admin", {
      layout: false,
      user: user,
      bag_num: user.length,
      num_donors: user.length,

      num_req: userRequest.length,
    });
  } else {
    res.redirect("/");
  }
});

router.get("/report", async (req, res, next) => {
  if (req.user && req.user.role == "admin" && req.isAuthenticated()) {
    res.render("report", { layout: false, error_msg: req.flash("error_msg") });
  } else {
    res.redirect("/");
  }
});

router.post("/report", async (req, res, next) => {
  if (req.user && req.user.role == "admin" && req.isAuthenticated()) {
    const user = await userModel.findOne({ donateId: req.body.donateId });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });
    const message = {
      from: "winter",
      to: user.email,
      subject: "Booking Accept",
      html: req.body.text,
    };
    transporter.sendMail(message, async (error, info) => {
      if (error) {
        console.log(
          `Error occurred while sending email to ${req.body.email}: `,
          error
        );
      } else {
        console.log(`Email sent to ${req.body.email}: `, info.response);
        res.redirect("/hostAdmins/report");
        /////////////////////////////////////
      }
    });
  } else {
    res.redirect("/");
  }
});

module.exports = router;
