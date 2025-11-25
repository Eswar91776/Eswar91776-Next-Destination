const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

const Listing = require('./models/listing');
const Review = require('./models/review');

const wrapAsync = require('./utils/wrapAsync');
const ExpressError = require('./utils/ExpressError');

const { listingSchema, reviewSchema } = require("./schema");

// ------------------ MIDDLEWARE ------------------

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// EJS setup
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ------------------ DATABASE CONNECTION ------------------

main()
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/nextdestinationDB');
}

// ------------------ VALIDATION MIDDLEWARE ------------------

const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error.details[0].message);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(400, error.details[0].message);
  } else {
    next();
  }
};

// ------------------ ROUTES ------------------

// Home route
app.get('/', (req, res) => {
  res.send("Welcome to NextDestination");
});

// INDEX route
app.get('/listings', wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render('listings/index', { allListings });
}));

// NEW form route
app.get('/listings/new', (req, res) => {
  res.render('listings/new');
});

// SHOW route
app.get('/listings/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render('listings/show', { listing });
}));


// CREATE route
app.post('/listings', validateListing, wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect('/listings');
}));

// EDIT form
app.get('/listings/:id/edit', wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  res.render('listings/edit', { listing });
}));

// UPDATE route
app.put('/listings/:id', validateListing, wrapAsync(async (req, res) => {
  const { id } = req.params;
  const updated = await Listing.findByIdAndUpdate(id, req.body.listing, { new: true });
  res.redirect(`/listings/${updated._id}`);
}));

// DELETE listing
app.delete('/listings/:id', wrapAsync(async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  res.redirect('/listings');
}));

// CREATE review
app.post('/listings/:id/reviews', validateReview, wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  const review = new Review(req.body.review);
  listing.reviews.push(review);

  await review.save();
  await listing.save();

  res.redirect(`/listings/${listing._id}`);
}));


// DELETE review
app.delete('/listings/:id/reviews/:reviewId', wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    // Remove review from listing array
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // Delete review document
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}));


// ------------------ 404 HANDLER ------------------

app.use((req, res) => {
  res.status(404).render('listings/error', { err: { message: "Page Not Found" } });
});

// ------------------ GENERIC ERROR HANDLER ------------------

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong!";
  res.status(statusCode).render('listings/error', { err });
});

// ------------------ SERVER ------------------

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
