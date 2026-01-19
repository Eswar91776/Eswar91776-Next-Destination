require("dotenv").config();
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);


const Listing = require("../models/listing");
const { data } = require("./data");

const dbUrl = process.env.ATLASDB_URL;

mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
  })
  .catch(err => {
    console.log("❌ MongoDB connection error:", err);
  });

const initDB = async () => {
  await Listing.deleteMany({});

  const listings = data.map(obj => ({
  ...obj,
  owner: new mongoose.Types.ObjectId("696e0e9ee0c95f5d7ce1f70d")
}));


  await Listing.insertMany(listings);
  console.log("🌱 Database seeded successfully!");
};

initDB().then(() => {
  mongoose.connection.close();
});
