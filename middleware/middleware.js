const Listing = require("../models/listing");
const Review = require("../models/review");
const { listingSchema, reviewSchema } = require("../schema");
const ExpressError = require("../utils/ExpressError");

// ==========================
// LOGIN CHECK
// ==========================
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in!");
    return res.redirect("/login");
  }
  next();
};

// ==========================
// LISTING OWNER CHECK
// ==========================
module.exports.isOwner = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You do not have permission!");
    return res.redirect(`/listings/${req.params.id}`);
  }
  next();
};

// ==========================
// PREVENT OWNER REVIEWING OWN LISTING
// ==========================
module.exports.isNotOwner = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (listing.owner.equals(req.user._id)) {
    req.flash("error", "You cannot review your own listing!");
    return res.redirect(`/listings/${req.params.id}`);
  }
  next();
};

// ==========================
// REVIEW AUTHOR CHECK
// ==========================
module.exports.isReviewAuthor = async (req, res, next) => {
  const review = await Review.findById(req.params.reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission!");
    return res.redirect(`/listings/${req.params.id}`);
  }
  next();
};

// ==========================
// VALIDATION
// ==========================
module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error.details[0].message);
  }
  next();
};

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error.details[0].message);
  }
  next();
};

// ==========================
// SAVE REDIRECT URL
// ==========================
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};
