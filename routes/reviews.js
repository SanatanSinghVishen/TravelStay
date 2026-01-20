const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, verifyToken, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

// POST Review
router.post("/",
  verifyToken,
  validateReview,
  wrapAsync(reviewController.createReview)
);

// DELETE Review
router.delete("/:reviewId",
  verifyToken,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = router;