const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  file: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
  },
  nationalID: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
    lowercase: true,
  },
  address: { type: String, required: true },
  // birthDate: { type: Date, required: true },
  birthYear: { type: Number, require: true },
  birthMonth: { type: Number, require: true },
  birthDay: { type: Number, require: true },

  bloodType: {
    type: String,
    required: true,
    enum: ["AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"],
  },
  countDonate: { type: Number, default: 0 },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Pre>to hash password before Save

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    var salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hashSync(this.password, salt);
  }
  next();
});

UserSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email });
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
