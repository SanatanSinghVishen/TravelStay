const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { verifyToken, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

router.route("/")
  .get(wrapAsync(listingController.index))
  .post(
    verifyToken,
    upload.single('listing[image]'), // Expecting 'listing[image]' field name
    // validateListing, // Note: Validating text fields might be tricky with Multipart/FormData depending on order.
    // Ideally validation happens after body parsing. 
    // In express, multer populates req.body.
    validateListing,
    wrapAsync(listingController.createListing)
  );

router.route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    verifyToken,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.editListing)
  )
  .delete(
    verifyToken,
    isOwner,
    wrapAsync(listingController.deleteListing)
  );

// Debug route (Optional, keeping for checks)
router.get("/debug", async (req, res) => {
  const listings = await Listing.find({});
  res.json({ count: listings.length, listings });
});

module.exports = router;
