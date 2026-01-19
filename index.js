require("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const MongoStore = require("connect-mongo");

const User = require("./models/user");

// ==========================
// TRUST PROXY (RENDER FIX ✅)
// ==========================
app.set("trust proxy", 1);

// ==========================
// DATABASE (MONGODB ATLAS)
// ==========================
const dbUrl = process.env.ATLASDB_URL;

mongoose.set("strictQuery", true);

mongoose
  .connect(dbUrl)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.log("❌ MongoDB error:", err));

// ==========================
// VIEW ENGINE
// ==========================
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ==========================
// MIDDLEWARE
// ==========================
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// ==========================
// SESSION STORE (WORKS LOCAL + RENDER)
// ==========================
const store = MongoStore.create({
  mongoUrl: dbUrl,
  collectionName: "sessions",
  touchAfter: 24 * 3600
});

store.on("error", e => {
  console.log("SESSION STORE ERROR:", e);
});

const sessionConfig = {
  store,
  name: "nextdestination",
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
};

app.use(session(sessionConfig));
app.use(flash());

// ==========================
// PASSPORT CONFIG
// ==========================
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ==========================
// GLOBAL VARIABLES
// ==========================
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// ==========================
// ROUTES
// ==========================
const listingRoutes = require("./routes/listing");
const reviewRoutes = require("./routes/review");
const userRoutes = require("./routes/user");

app.use("/", userRoutes);
app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", reviewRoutes);

// ==========================
// HOME REDIRECT
// ==========================
app.get("/", (req, res) => {
  res.redirect("/listings");
});

// ==========================
// SERVER
// ==========================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
