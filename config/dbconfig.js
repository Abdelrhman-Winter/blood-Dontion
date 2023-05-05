const mongoose = require("mongoose");
const MainAdmin = require("../models/mainAdminModel");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // call createDefaultAdminAccount with desired admin name and password
    MainAdmin.createDefaultAdminAccount(
      process.env.MAIN_ADMIN_USER,
      process.env.MAIN_ADMIN_PASS
    );

    // Connect to MongoDB

    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
module.exports = connectDB;
