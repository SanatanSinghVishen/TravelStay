if (process.env.NODE_ENV != "production") {
  require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wanderlust";
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js"); 


const listingRouter = require("./routes/listing.js"); 
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,"/public"))); //to serve static files
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);


const sessionOptions = {
  secret: process.env.SECRET ,
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

passport.serializeUser(User.serializeUser()); // storing the user info into the session
passport.deserializeUser(User.deserializeUser()); // unstoring the user info from the session



app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// app.get("/demoUser",async (req,res)=>{
//   let fakeUser = new User({
//     email : "student@gmail.com",
//     username : "delta-student"
//   });

//   let registeredUser = await User.register(fakeUser,"helloworld");
//   res.send(registeredUser);
// });


// Connect to MongoDB first
async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log(`Connected to MongoDB at ${MONGO_URL}`);
    
    // Start server only after successful database connection
    const port = process.env.PORT || 0; // Use 0 to let OS assign a free port
    const server = app.listen(port, () => {
      const actualPort = server.address().port;
      console.log(`Server is listening to port ${actualPort}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

// Define routes
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) => { //if user requests a route that does not exist then after tracing all the routes it will come here and display page not found error
  next(new ExpressError(404, "Page not Found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  
  // Log error for debugging
  console.error(`Error ${statusCode}: ${message}`);
  console.error(err.stack);
  
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error", { err, statusCode, message });
});

// Start the application
main();