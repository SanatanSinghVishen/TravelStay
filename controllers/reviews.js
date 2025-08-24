const Listing = require("../models/listing");
const Review = require("../models/review");

// CREATE Review
module.exports.createReview = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found.");
    return res.redirect("/listings");
  }

  if (!req.body.review) {
    req.flash("error", "Review data is required.");
    return res.redirect(`/listings/${id}`);
  }

  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;

  listing.reviews.push(newReview);

  try {
    await newReview.save();
    await listing.save();
    req.flash("success", "New review created!");
    res.redirect(`/listings/${id}`);
  } catch (error) {
    req.flash("error", "Failed to create review. Please try again.");
    res.redirect(`/listings/${id}`);
  }
};

// DELETE Review
module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;

  // Check if listing exists
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  // Check if review exists
  const review = await Review.findById(reviewId);
  if (!review) {
    req.flash("error", "Review not found!");
    return res.redirect(`/listings/${id}`);
  }

  try {
    // Remove review reference from listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // Delete review itself
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted successfully!");
    res.redirect(`/listings/${id}`);
  } catch (error) {
    req.flash("error", "Failed to delete review. Please try again.");
    res.redirect(`/listings/${id}`);
  }
};
