const { check, body } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");

// User management validators
exports.registerValidator = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .custom((value, { req }) => {
      // if (value === 'test@test.com') {
      //     throw new Error('This email is forbidden');
      // }
      // return true;
      return User.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject("Email already registered");
        }
      });
    })
    .normalizeEmail(),
  body(
    "password",
    "Please enter a password with only numbers and text length between 5 and 16"
  )
    .isLength({
      min: 5,
      max: 16,
    })
    .isAlphanumeric()
    .trim(),
  body("repeatedPassword")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords have to match!");
      }
      return true;
    })
    .trim(),
];

exports.loginValidator = [
  body("email", "Enter valid e-mail address").isEmail().normalizeEmail(),
  body("password")
    .trim()
    .custom((value, { req }) => {
      return User.findOne({ email: req.body.email }).then((user) => {
        if (!user) {
          return Promise.reject("User with this email address doesn't exist");
        }
        return bcrypt.compare(value, user.password).then((doMatch) => {
          if (!doMatch) {
            return Promise.reject("Invalid password");
          }
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save((err) => {
            console.log(err);
          });
        });
      });
    }),
];

// Shop interface validators:
exports.productValidator = [
  body("title", "Title has to have minimum of 3 characters (alphanumeric only)")
    .isString()
    .isLength({ min: 3 })
    .trim(),
  body("imageUrl", "Url Missing Or Invalid").isURL(),
  body("price", "Price Missing Or Invalid").isFloat(),
  body("description", "Description Missing Or Invalid")
    .isLength({ min: 8 })
    .trim(),
];
