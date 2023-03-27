//serves
const dotenv = require("dotenv").config(),
  express = require("express"),
  expressLayouts = require("express-ejs-layouts"),
  flash = require("connect-flash"),
  colors = require("colors"),
  session = require("express-session"),
  passport = require("passport"),
  app = express(),
  MongoStore = require("connect-mongo"),
  cron = require("node-cron");

// using app.use to serve up static CSS and js files in public
app.use("/public", express.static("public"));

//passport config
require("./controller/signInPassport")(passport);

// modules import from folders
const dbConnection = require("./config/dbconfig");

// Connect DB
dbConnection();

//EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

//Bodyparser
app.use(express.urlencoded({ extended: false }));

//express session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

// connect flash
app.use(flash());

//Global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});
app.use(function (req, res, next) {
  res.locals.authenticated = req.isAuthenticated();
  res.locals.user = req.user;
  next();
});

//Routes
app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

const { deleteStaleBookings } = require("./controller/bookingController");

// Schedule the cron job to run every hour
cron.schedule("0 * * * *", () => {
  console.log("Running the deleteStaleBookings cron job");
  deleteStaleBookings();
});
