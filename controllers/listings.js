const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");
const { deleteImage } = require("../utils/cloudinaryUtils");

// INDEX — Show all listings
module.exports.index = async (req, res) => {
  try {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  } catch (error) {
    req.flash("error", "Failed to load listings. Please try again.");
    res.redirect("/");
  }
};

// NEW — Render form to create a new listing
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
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
      req.flash("error", "Listing you requested for doesn't exist!");
      return res.redirect("/listings");
    }

    res.render("listings/show", { listing });
  } catch (error) {
    req.flash("error", "Failed to load listing. Please try again.");
    res.redirect("/listings");
  }
};

// CREATE — Create a new listing
module.exports.createListing = async (req, res) => {
  console.log('🔍 Create listing request received');
  console.log('Body:', req.body);
  console.log('File:', req.file);
  console.log('User:', req.user ? req.user._id : 'No user');
  
  if (!req.body.listing) {
    console.log('❌ No listing data in body');
    throw new ExpressError(400, "Invalid listing data!");
  }

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;

  if (req.file) {
    // Cloudinary file - req.file.path contains the Cloudinary URL
    console.log('✅ Image uploaded to Cloudinary:', req.file.path);
    console.log('📁 File details:', {
      originalname: req.file.originalname,
      filename: req.file.filename,
      path: req.file.path,
      size: req.file.size
    });
    newListing.image = { url: req.file.path, filename: req.file.filename };
    console.log('💾 Saving image data:', newListing.image);
  } else {
    console.log('❌ No image file uploaded');
    throw new ExpressError(400, "Image is required for creating a listing!");
  }

  try {
    console.log('💾 Saving listing to database...');
    await newListing.save();
    console.log('✅ Listing saved successfully');
    req.flash("success", "New listing created!");
    console.log('🔄 Redirecting to /listings');
    res.redirect("/listings");
  } catch (error) {
    console.error('❌ Error saving listing:', error);
    req.flash("error", "Failed to create listing. Please try again.");
    res.redirect("/listings/new");
  }
};

// EDIT FORM — Render edit form
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  
  try {
    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Listing you requested for doesn't exist!");
      return res.redirect("/listings");
    }

    res.render("listings/edit", { listing });
  } catch (error) {
    req.flash("error", "Failed to load listing for editing. Please try again.");
    res.redirect("/listings");
  }
};

// UPDATE — Update a listing
module.exports.editListing = async (req, res) => {
  if (!req.body.listing) {
    throw new ExpressError(400, "Invalid listing data!");
  }

  const { id } = req.params;
  
  try {
    // First, find the listing to get the current image info
    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    // Update the listing data
    Object.assign(listing, req.body.listing);

    if (req.file) {
      // Delete old image from Cloudinary if it exists
      if (listing.image && listing.image.url) {
        try {
          await deleteImage(listing.image.url);
          console.log('✅ Old image deleted from Cloudinary');
        } catch (deleteError) {
          console.error('Failed to delete old image from Cloudinary:', deleteError);
          // Continue with update even if old image deletion fails
        }
      }
      
      // Set new image
      listing.image = { url: req.file.path, filename: req.file.filename };
    }

    // Save the updated listing
    await listing.save();

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${id}`);
  } catch (error) {
    req.flash("error", "Failed to update listing. Please try again.");
    res.redirect(`/listings/${id}/edit`);
  }
};

// DELETE — Delete a listing
module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  
  try {
    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    // Delete image from Cloudinary if it exists
    if (listing.image && listing.image.url) {
      try {
        await deleteImage(listing.image.url);
        console.log('✅ Image deleted from Cloudinary');
      } catch (deleteError) {
        console.error('Failed to delete image from Cloudinary:', deleteError);
        // Continue with listing deletion even if image deletion fails
      }
    }

    // Delete the listing
    await Listing.findByIdAndDelete(id);

    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
  } catch (error) {
    req.flash("error", "Failed to delete listing. Please try again.");
    res.redirect(`/listings/${id}`);
  }
};
