//User model
const User = require("../models/userModel");

const jwt = require("jsonwebtoken");

const verifyEmail = async (req, res) => {
  const jwt_Secret = process.env.JWT_SECRET;
  const { id, token } = req.params;
  console.log(id);
  const user = await User.findById({ _id: id });
  if (!user) {
    req.flash("error_msg", "Invalid id....");
    res.redirect("/users/forgot");
    return;
  }
  const secret = jwt_Secret + user.password;
  try {
    const payload = jwt.verify(token, secret);
    res.render("reset", { email: user.email });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

module.exports = verifyEmail;
