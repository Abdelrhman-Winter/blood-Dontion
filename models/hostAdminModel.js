const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const HostAdminSchema = new mongoose.Schema({
  adminname: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "admin", // set the default value to be 'admin'
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  hospitalName: {
    type: String,
    required: true,
  },
});



// Pre>to hash password before Save
HostAdminSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    var salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hashSync(this.password, salt);
  }
  next();
});

HostAdminSchema.statics.findByAdminname = function (adminname) {
  return this.findOne({ adminname: adminname });
};

module.exports = mongoose.model("HostAdmin", HostAdminSchema);

