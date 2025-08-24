const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");

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
  if (!req.body.listing) {
    throw new ExpressError(400, "Invalid listing data!");
  }

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;

  if (req.file) {
    newListing.image = { url: req.file.path, filename: req.file.filename };
  }

  try {
    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
  } catch (error) {
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
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    if (req.file) {
      listing.image = { url: req.file.path, filename: req.file.filename };
      await listing.save();
    }

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
    const listing = await Listing.findByIdAndDelete(id);

    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
  } catch (error) {
    req.flash("error", "Failed to delete listing. Please try again.");
    res.redirect(`/listings/${id}`);
  }
};
