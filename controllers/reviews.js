const Listing = require("../models/listing");
const Review = require("../models/review");

// CREATE Review
module.exports.createReview = async (req, res) => {
  const { id } = req.params;

  if (!req.body.review) {
    return res.status(400).json({ error: "Review data is required." });
  }

  try {
    const listing = await Listing.findById(id);
    if (!listing) return res.status(404).json({ error: "Listing not found." });

    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    res.status(201).json({ message: "New review created!", review: newReview });
  } catch (error) {
    res.status(500).json({ error: "Failed to create review." });
  }
};

// DELETE Review
module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;

  try {
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    res.json({ message: "Review deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete review." });
  }
};
