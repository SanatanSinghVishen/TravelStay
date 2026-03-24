if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const ExpressError = require("./utils/ExpressError.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// Database connection
const dburl = process.env.ATLAS_DB || "mongodb://127.0.0.1:27017/travelstay";

const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL, "http://localhost:5173"] : "*",
  credentials: true,
};
app.use(cors(corsOptions)); // Allow Cross-Origin requests
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// Passport Configuration (Stateless)
app.use(passport.initialize());
passport.use(new LocalStrategy(User.authenticate()));

// Health check route
app.get("/health", (req, res) => {
  res.json({
    status: "Server is running",
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
  });
});

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to TravelStay API" });
});

// Routes
// Note: We are using /api/listings to distinguish from old routes if needed, 
// but for the frontend transition, the paths in routers need to match.
// The routers themselves define the subpaths. 
// listingRouter handles "/" -> so app.use("/listings") makes it "/listings/"
// Let's keep the existing path structure for now but return JSON.
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
  // if (err.stack) console.error(err.stack);
  res.status(statusCode).json({ error: message, statusCode });
});

// Connect to MongoDB
async function main() {
  try {
    const mongooseOptions = {};
    if (dburl.includes("mongodb+srv://")) {
      mongooseOptions.tls = true;
      mongooseOptions.tlsAllowInvalidCertificates = true;
    }

    await mongoose.connect(dburl, mongooseOptions);
    console.log(`✅ Connected to MongoDB at ${dburl}`);

    const port = process.env.PORT || 3001;
    app.listen(port, "0.0.0.0", () => {
      console.log(`🚀 API Server listening on port ${port}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
  }
}

main();
