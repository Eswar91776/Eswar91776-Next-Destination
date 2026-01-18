const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync");
const reviewsController = require("../controllers/reviews");

const {
    isLoggedIn,
    isReviewAuthor,
    validateReview
} = require("../middleware/middleware");

// ==========================
// CREATE REVIEW
// ==========================
router.post(
    "/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewsController.createReview)
);

// ==========================
// EDIT REVIEW FORM
// ==========================
router.get(
    "/:reviewId/edit",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewsController.renderEditForm)
);

// ==========================
// UPDATE REVIEW
// ==========================
router.put(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    validateReview,
    wrapAsync(reviewsController.updateReview)
);

// ==========================
// DELETE REVIEW
// ==========================
router.delete(
    "/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewsController.deleteReview)
);

module.exports = router;
