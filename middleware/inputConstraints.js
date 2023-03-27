const User = require("../models/userModel");

// Require the express-validator module
const { check, body } = require("express-validator");

// Define a validation function
const signupValidator = [
  // Check the Name field
  check("firstName")
    .exists()
    .withMessage("Name is required")
    .not()
    .isEmpty()
    .withMessage("Name is required"),

  check("lastName")
    .exists()
    .withMessage("Name is required")
    .not()
    .isEmpty()
    .withMessage("Name is required"),

  // Check the Email field
  check("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .custom((email) => {
      return User.findByEmail(email).then((user) => {
        if (user) {
          throw new Error();
        }
      });
    })
    .withMessage("Email already in use"),

  // Check the password field
  check("password")
    .exists()
    .withMessage("Password is required")
    .not()
    .isEmpty()
    .withMessage("Password is required")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/
    )
    .withMessage(
      "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
    ),
  // Check the passwordConfirmation field
  body("passwordConfirmation")
    .exists({ checkFalsy: true })
    .withMessage("Password confirmation is required")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("The password confirmation do not match"),
  // Check the Phone number
  check("phone")
    .notEmpty()
    .withMessage("phone is Required")
    .isMobilePhone("ar-EG")
    .withMessage("Please enter Egyptian number"),
  // Check the NationalID
  check("nationalID")
    .notEmpty()
    .withMessage("National ID is Required")
    .isInt()
    .withMessage("Please enter valid national ID")
    .isLength({ min: 14, max: 14 })
    .withMessage("Please enter valid national ID"),

  check("city").exists().withMessage("Please Select city"),

  check("address").exists().withMessage("Please add address"),

  check("bloodType").exists().withMessage("Please Select bloodType"),

  check("birthDay").isNumeric().withMessage("Please enter birthday "),
  check("birthMonth").isNumeric().withMessage("Please enter birthmonth "),
  check("birthYear").isNumeric().withMessage("Please enter birthyear "),
];

const EditingValidator = [
  // Check the Name field
  check("firstName")
    .exists()
    .withMessage("Name is required")
    .not()
    .isEmpty()
    .withMessage("Name is required"),

  check("lastName")
    .exists()
    .withMessage("Name is required")
    .not()
    .isEmpty()
    .withMessage("Name is required"),

  // Check the Phone number
  check("phone")
    .notEmpty()
    .withMessage("phone is Required")
    .isMobilePhone("ar-EG")
    .withMessage("Please enter Egyptian number"),
  // Check the NationalID
  check("nationalID")
    .notEmpty()
    .withMessage("National ID is Required")
    .isInt()
    .withMessage("Please enter valid national ID")
    .isLength({ min: 14, max: 14 })
    .withMessage("Please enter valid national ID"),
  check("city").exists().withMessage("Please Select city"),
  check("address").exists().withMessage("Please add address"),

  check("bloodType").exists().withMessage("Please Select bloodType"),
];

const passwordValidator = [
  // Check the password field
  check("password")
    .exists()
    .withMessage("Password is required")
    .not()
    .isEmpty()
    .withMessage("Password is required")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/
    )
    .withMessage(
      "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
    ),
  // Check the passwordConfirmation field
  body("passwordConfirmation")
    .exists({ checkFalsy: true })
    .withMessage("Password confirmation is required")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("The password confirmation do not match"),
];
const contactValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Email is not valid").normalizeEmail(),
  body("subject").notEmpty().withMessage("subject is required"),
  body("message").notEmpty().withMessage("Message is required"),
];

const bookingValidator = [
  // Validate date is not before today
  // body("bookingDate").custom((value) => {
  //   const today = new Date();
  //   const bookingDate = new Date(value);
  //   if (bookingDate < today) {
  //     throw new Error("Booking date must be today or later");
  //   }
  //   return true;
  // }),

  // Validate location is selected
  body("location").notEmpty().withMessage("Location is required"),

  // Validate additionalInfo is not too long
  body("additionalInfo")
    .isLength({ max: 500 })
    .withMessage("Additional information must be less than 500 characters"),
];
// Sanitize the Name field
const sanitizeName = [body("name").escape()];

// Sanitize the Name field
const sanitizeEmail = [body("email").escape()];

// Sanitize the password field
const sanitizePassword = [body("password").escape()];

module.exports = {
  signupValidator,
  EditingValidator,
  passwordValidator,
  contactValidator,
  bookingValidator,
  sanitizeName,
  sanitizeEmail,
  sanitizePassword,
};
