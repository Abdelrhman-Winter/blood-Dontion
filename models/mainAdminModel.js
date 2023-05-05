const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const mainAdminSchema = new mongoose.Schema({
  adminname: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "mainAdmin",
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

mainAdminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    var salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hashSync(this.password, salt);
  }
  next();
});

mainAdminSchema.statics.createDefaultAdminAccount = async function (
  adminname,
  password
) {
  try {
    const count = await this.countDocuments({ role: "mainAdmin" });
    if (count === 0) {
      const mainAdmin = new this({
        adminname: adminname,
        password: password,
      });
      await mainAdmin.save();
      console.log(
        `Default mainAdmin account with username "${adminname}" created.`
      );
    }
  } catch (err) {
    console.error(err);
  }
};

module.exports = mongoose.model("MainAdmin", mainAdminSchema);
