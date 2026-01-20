const Listing = require("../models/listing");
const { deleteImage } = require("../utils/cloudinaryUtils");

// INDEX — Show all listings
module.exports.index = async (req, res) => {
  try {
    const allListings = await Listing.find({});
    res.json(allListings);
  } catch (error) {
    res.status(500).json({ error: "Failed to load listings." });
  }
};

// SHOW — Show details of one listing
module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  try {
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: { path: "author" }
      })
      .populate("owner");

    if (!listing) {
      return res.status(404).json({ error: "Listing not found!" });
    }

    res.json(listing);
  } catch (error) {
    res.status(500).json({ error: "Failed to load listing." });
  }
};

// CREATE — Create a new listing
module.exports.createListing = async (req, res) => {
  // Validations are handled by middleware (validateListing) before this

  try {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; // Req.user from JWT

    if (req.file) {
      newListing.image = { url: req.file.path, filename: req.file.filename };
    } else {
      return res.status(400).json({ error: "Image is required!" });
    }

    await newListing.save();
    res.status(201).json({ message: "New listing created!", listing: newListing });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// UPDATE — Update a listing
module.exports.editListing = async (req, res) => {
  const { id } = req.params;

  try {
    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({ error: "Listing not found!" });
    }

    // Update fields
    if (req.body.listing) {
      Object.assign(listing, req.body.listing);
    }

    if (req.file) {
      // Delete old image
      if (listing.image && listing.image.url) {
        try {
          await deleteImage(listing.image.url);
        } catch (e) { console.error("Cloudinary delete failed", e); }
      }
      listing.image = { url: req.file.path, filename: req.file.filename };
    }

    await listing.save();
    res.json({ message: "Listing updated successfully!", listing });
  } catch (error) {
    res.status(400).json({ error: "Failed to update listing." });
  }
};

// DELETE — Delete a listing
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;

  try {
    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({ error: "Listing not found!" });
    }

    if (listing.image && listing.image.url) {
      try {
        await deleteImage(listing.image.url);
      } catch (e) { console.error("Cloudinary delete failed", e); }
    }

    await Listing.findByIdAndDelete(id);
    res.json({ message: "Listing deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete listing." });
  }
};
