if (process.env.NODE_ENV != "production") {
  require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const multer = require("multer");

// Database connection with fallback
const dburl = process.env.ATLAS_DB || "mongodb://127.0.0.1:27017/travelstay";

const listingRouter = require("./routes/listing.js"); 
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,"/public")));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);

const sessionOptions = {
  secret: process.env.SECRET || "fallback-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production"
  }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// User middleware with error handling
app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  
  // Safely handle user authentication
  try {
    res.locals.currUser = req.user || null;
  } catch (error) {
    console.log('User middleware error:', error.message);
    res.locals.currUser = null;
  }
  
  next();
});

// Health check route
app.get("/health", (req, res) => {
  res.json({
    status: "Server is running",
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"
  });
});

// Test route
app.get("/test", (req, res) => {
  res.send("Server is running! Database status: " + (mongoose.connection.readyState === 1 ? "Connected" : "Disconnected"));
});

// Connect to MongoDB with fallback
async function main() {
  try {
    const mongooseOptions = {};
    
    // Add TLS options for Atlas connection
    if (dburl.includes('mongodb+srv://')) {
      mongooseOptions.tls = true;
      mongooseOptions.tlsAllowInvalidCertificates = true;
    }
    
    await mongoose.connect(dburl, mongooseOptions);
    console.log(`✅ Connected to MongoDB at ${dburl}`);
    
    // Start server after successful database connection
    const port = process.env.PORT || 0;
    const server = app.listen(port, () => {
      const actualPort = server.address().port;
      console.log(`🚀 Server is listening to port ${actualPort}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    console.log("⚠️  Starting server without database connection...");
    
    // Start server even if database fails (for testing)
    const port = process.env.PORT || 0;
    const server = app.listen(port, () => {
      const actualPort = server.address().port;
      console.log(`🚀 Server is listening to port ${actualPort} (Database connection failed)`);
    });
  }
}

// Multer error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error('❌ Multer error:', err);
    if (err.code === 'LIMIT_FILE_SIZE') {
      req.flash('error', 'File too large. Please use an image under 10MB.');
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      req.flash('error', 'Unexpected file field. Please check your form.');
    } else {
      req.flash('error', 'File upload failed. Please try again.');
    }
    return res.redirect('/listings/new');
  }
  next(err);
});

// Define routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// 404 handler
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not Found!"));
});

// Error handler
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  
  console.error(`❌ Error ${statusCode}: ${message}`);
  if (err.stack) console.error(err.stack);
  
  res.status(statusCode).render("error", { err, statusCode, message });
});

// Start the application
main();