const { validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const booking = require("../models/bookingModel");

const handleBookingFormSubmission = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // If there are validation errors, show the form again with error messages
    const errorMessages = errors.array().map((error) => error.msg);
    req.flash("error_msg", errorMessages);
    return res.redirect("/users/booking");
  }

  // If validation succeeds, process the booking and send confirmation to user
  const { location, additionalInfo } = req.body;
  console.log(location, additionalInfo);
  // Get user account name and email from session or database
  const accountName = req.user.name;
  const email = req.user.email;
  const user = req.user;
  console.log(email);
  // Generate confirmation token
  const confirmationToken =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  console.log(confirmationToken);
  // Save the booking to the database with the confirmation token
  const newBooking = new booking({
    location,
    additionalInfo,
    confirmationToken,
    user: user,
  });

  await newBooking.save();

  // Create confirmation URL with the token
  const confirmationUrl = `http://localhost:3000/users/bookingConfirmation?token=${confirmationToken}`;

  // Send confirmation email to user
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const message = {
    from: "winter",
    to: email,
    subject: "Booking confirmation",
    html: `
      Hi ${accountName},<br><br>
      Your booking for dontion blood for loction ${location}  has been received.<br><br>
      Additional information: ${additionalInfo}<br><br>
      To confirm your booking, please click the button below:<br><br>
      <a href="${confirmationUrl}" target="_blank" style="background-color: #008CBA; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 4px;">Confirm booking</a>
    `,
  };

  transporter.sendMail(message, async (error, info) => {
    if (error) {
      console.log("Error occurred while sending email: ", error);
      return res.render("booking", {
        errors: [],
        success_msg: "",
        error_msg: "An error occurred while sending email.",
        error: error,
      });
    } else {
      console.log("Email sent: ", info.response);

      return res.render("booking", {
        errors: [],
        success_msg:
          "Your booking has been received. Check your email for confirmation.",
        error_msg: "",
        error: "",
      });
    }
  });
};

const handleBookingConfirmation = async (req, res) => {
  const token = req.query.token;
  const confirmationToken = req.query.token;
  console.log(confirmationToken);
  // Find the booking with the confirmation token
  const confirmedBooking = await booking.findOneAndUpdate(
    { confirmationToken: token },
    { isConfirmed: true },
    { new: true }
  );
  console.log(confirmedBooking);

  if (!confirmedBooking) {
    return res.status(404).send("Booking not found");
  }

  // Get the booking date as a Date object
  const accountName = req.user.firstName;

  // Format the date to a string containing only the date with the day, month, and year
  console.log(accountName);
  return res.render("bookingConfirmation", {
    accountName: accountName,
    location: confirmedBooking.location,
    additionalInfo: confirmedBooking.additionalInfo,
    success_msg: "Your booking has been confirmed.",
  });
};

// Run this function periodically (e.g., every hour) to delete stale bookings
const deleteStaleBookings = async () => {
  console.log("hi");
  const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
  const staleBookings = await booking
    .find({
      createdAt: { $lt: cutoffDate },
      isConfirmed: false,
    })
    .populate("user"); // populate the user property

  console.log(`Found ${staleBookings.length} stale bookings`);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  for (const staleBooking of staleBookings) {
    // Get the email of the user associated with the stale booking
    const email = staleBooking.user.email;
    console.log(email);
    console.log(staleBooking.user);
    // Send an email to the user notifying them that their booking has been deleted
    const message = {
      from: "winter",
      to: email,
      subject: "Booking deletion",
      html: `
        Hi ${staleBooking.user.name},<br><br>
        Your booking for location ${
          staleBooking.location
        } on ${staleBooking.createdAt.toLocaleString()} has been automatically deleted because it was not confirmed within 24 hours of being created.<br><br>
        If you still need to make a booking, please visit our website again.<br><br>
        Thank you for your understanding<br><br>
        with dontion Team love &#128420;.
      `,
    };
    transporter.sendMail(message, (error, info) => {
      if (error) {
        console.log(`Error occurred while sending email to ${email}: `, error);
      } else {
        console.log(`Email sent to ${email}: `, info.response);
      }
    });
  }

  const result = await booking.deleteMany({
    createdAt: { $lt: cutoffDate },
    isConfirmed: false,
  });
  console.log(`Deleted ${result.deletedCount} stale bookings`);
};

module.exports = {
  handleBookingFormSubmission,
  handleBookingConfirmation,
  deleteStaleBookings,
};
