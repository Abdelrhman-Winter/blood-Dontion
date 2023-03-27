//User model
const User = require("../models/userModel");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const CreatandSendRestLink = async (req, res) => {
  const jwt_Secret = process.env.JWT_SECRET;

  let email;
  if (req.user) {
    // If user is logged in, get their email from req.user
    email = req.user.email;
  } else {
    // If user is not logged in, get email from request body
    email = req.body.email;
  }
  //check the email exist
  const user = await User.findOne({ email: email });
  if (!user) {
    req.flash("error_msg", "That email has not existed");
    res.redirect("/users/forgot");
  } else {
    const secret = jwt_Secret + user.password;
    const payload = { email: user.email, id: user._id };

    //set the token with time
    const expireTime = process.env.TOKEN_EXPIRE_TIME;
    const token = jwt.sign(payload, secret, { expiresIn: expireTime });

    //creat the link and send it
    const link = `http://localhost:3000/users/reset/${user.id}/${token}`;
    console.log(link);
    console.log("password reset link has been sent to ur mail");

    // send the email with the link
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: user.email,
      subject: "Password Reset Link",
      text: `Please click on the following link to reset your password: ${link}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      }
      console.log("Email sent: " + info.response);
      req.flash("success_msg", "mail sent successfully");
      const referer = req.headers.referer || "/users/forgot";
      res.redirect(referer);
    });
  }
};
module.exports = CreatandSendRestLink;
