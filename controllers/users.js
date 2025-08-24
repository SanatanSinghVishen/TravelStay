const User = require("../models/user");

// SIGNUP — Register new user
module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      req.flash("error", "All fields are required!");
      return res.redirect("/signup");
    }

    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to TravelStay!!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

// RENDER SIGNUP FORM
module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup");
};

// RENDER LOGIN FORM
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};

// LOGIN — after successful Passport authentication
module.exports.login = (req, res) => {
      req.flash("success", "Welcome back to TravelStay! You are logged in!");
  const redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

// LOGOUT
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "You are logged out now!");
    res.redirect("/listings");
  });
};
