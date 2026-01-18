const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../middleware/middleware");

// =====================
// SIGNUP PAGE
// =====================
router.get("/signup", (req, res) => {
  res.render("users/signup");
});

// =====================
// SIGNUP POST
// =====================
router.post(
  "/signup",
  wrapAsync(async (req, res, next) => {
    const { username, email, password } = req.body;

    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to NextDestination!");
      res.redirect("/listings");
    });
  })
);

// =====================
// LOGIN PAGE
// =====================
router.get("/login", (req, res) => {
  res.render("users/login");
});

// =====================
// LOGIN POST  ✅ THIS WAS CRASHING
// =====================
router.post(
  "/login",
  saveRedirectUrl, // ⚠️ MUST EXIST
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    delete req.session.redirectUrl;
    res.redirect(redirectUrl);
  }
);

// =====================
// LOGOUT
// =====================
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "Logged out!");
    res.redirect("/listings");
  });
});

module.exports = router;
