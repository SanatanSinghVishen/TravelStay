const express = require("express");
const router = express.Router();
const passport = require("passport");
const users = require("../controllers/users");
const { saveRedirectUrl } = require("../middleware");

// SIGNUP routes
router.route("/signup")
  .get(users.renderSignupForm)
  .post(users.signup);

// LOGIN routes
router.route("/login")
  .get(users.renderLoginForm)
  .post(saveRedirectUrl, passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login"
  }), users.login);

// LOGOUT
router.get("/logout", users.logout);

module.exports = router;
