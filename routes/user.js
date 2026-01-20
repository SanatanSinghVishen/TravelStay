const express = require("express");
const router = express.Router();
const passport = require("passport");
const users = require("../controllers/users");

// SIGNUP route (Only POST)
router.post("/signup", users.signup);

// LOGIN route (Only POST)
// Use session: false for JWT
router.post("/login",
  passport.authenticate("local", { session: false, failWithError: true }),
  users.login
);

// LOGOUT
router.post("/logout", users.logout); // Logout is typically a POST (state change) or client-side only

module.exports = router;
