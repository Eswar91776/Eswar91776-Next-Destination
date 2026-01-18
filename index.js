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
// DATABASE (ATLAS)
// ==========================
const dbUrl = process.env.ATLASDB_URL;

mongoose.set("strictQuery", true);

mongoose
  .connect(dbUrl)
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch(err => console.log("Mongo error:", err));

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
// SESSION STORE (ATLAS FIX ✅)
// ==========================
const store = MongoStore.create({
  mongoUrl: dbUrl,
  secret: process.env.SESSION_SECRET,
  touchAfter: 24 * 3600, // 1 day
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
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  },
};

app.use(session(sessionConfig));
app.use(flash());

// ==========================
// PASSPORT
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
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// ==========================
// ROUTES
// ==========================
const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");

app.use("/", userRouter);
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);

// ==========================
// SERVER
// ==========================
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
