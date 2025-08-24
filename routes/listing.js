const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");

// Use Cloudinary storage with error handling
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});


router.route("/")
.get(wrapAsync(listingController.index)
)
.post(
  isLoggedIn,
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingController.createListing)
);

// Debug route to check listings
router.get("/debug", async (req, res) => {
  try {
    const listings = await Listing.find({});
    res.json({
      count: listings.length,
      listings: listings.map(l => ({
        id: l._id,
        title: l.title,
        image: l.image
      }))
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

// New Route - Form to create a new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn, isOwner,
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingController.editListing))
.delete(isLoggedIn, isOwner,
  wrapAsync(listingController.deleteListing));

// Edit Route - Form to edit a listing
router.get(
  "/:id/edit", isLoggedIn, isOwner,
  wrapAsync(listingController.renderEditForm)
);


module.exports = router;
