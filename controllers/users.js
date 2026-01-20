const User = require("../models/user");
const jwt = require("jsonwebtoken");

const SECRET = process.env.SECRET || "fallback-secret-key";

// Helper to generate Token
const generateToken = (user) => {
  return jwt.sign({ _id: user._id, username: user.username, email: user.email }, SECRET, {
    expiresIn: "7d",
  });
};

// SIGNUP
module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);

    // Generate Token
    const token = generateToken(registeredUser);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { _id: registeredUser._id, username: registeredUser.username, email: registeredUser.email }
    });

  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// LOGIN
module.exports.login = (req, res) => {
  // Passport middleware checks credentials before this runs
  // If we are here, req.user is populated by Passport

  const token = generateToken(req.user);

  res.json({
    message: "Logged in successfully",
    token,
    user: { _id: req.user._id, username: req.user.username, email: req.user.email }
  });
};

// LOGOUT
module.exports.logout = (req, res) => {
  // Client should simply discard the token
  res.json({ message: "Logged out successfully" });
};
