const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const ListingsController = require("../controllers/listings");
const {
  isLoggedIn,
  isOwner,
  validateListing,
} = require("../middleware/middleware");

// INDEX + CREATE
router
  .route("/")
  .get(ListingsController.index)
  .post(
    isLoggedIn,
    upload.single("image"),
    validateListing,
    ListingsController.createListing
  );

// NEW
router.get("/new", isLoggedIn, ListingsController.renderNewForm);

// SHOW + UPDATE + DELETE
router
  .route("/:id")
  .get(ListingsController.showListing)
  .put(
    isLoggedIn,
    isOwner,
    upload.single("image"),
    validateListing,
    ListingsController.updateListing
  )
  .delete(
    isLoggedIn,
    isOwner,
    ListingsController.deleteListing
  );

// EDIT
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  ListingsController.renderEditForm
);

module.exports = router;
