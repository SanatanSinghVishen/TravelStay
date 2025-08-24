const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema, reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");

// Ensure user is logged in
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to create a listing.");
    return res.redirect("/login");
  }
  next();
};

// Save redirect URL (after login)
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

// Ensure the logged-in user is the owner of the listing
module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  
  if (!res.locals.currUser) {
    req.flash("error", "You must be logged in to perform this action!");
    return res.redirect("/login");
  }
  
  let listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  // listing.owner is an ObjectId → compare with currUser._id
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have permission to edit this listing!");
    return res.redirect(`/listings/${id}`);
  }

  next();
};

// Validate listing input with Joi
module.exports.validateListing = (req, res, next) => {
  try {
    const { error } = listingSchema.validate(req.body);
    if (error) {
      const errMsg = error.details.map((el) => el.message).join(", ");
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

// Validate review input with Joi
module.exports.validateReview = (req, res, next) => {
  try {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      const errMsg = error.details.map((el) => el.message).join(", ");
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};

// Ensure logged-in user is the author of the review
module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  
  if (!res.locals.currUser) {
    req.flash("error", "You must be logged in to perform this action!");
    return res.redirect("/login");
  }
  
  let review = await Review.findById(reviewId);

  if (!review) {
    req.flash("error", "Review not found!");
    return res.redirect(`/listings/${id}`);
  }

  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You didn't create this review!");
    return res.redirect(`/listings/${id}`);
  }

  next();
};
