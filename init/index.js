const mongoose = require("mongoose");
const Listing = require("../models/listing");
const { data } = require("./data");

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/nextdestinationDB");
  console.log("Connected to MongoDB");
}

const initDB = async () => {
  await Listing.deleteMany({});

  const listings = data.map(obj => ({
    ...obj,
    owner: new mongoose.Types.ObjectId("6953b694e555d5552620e61b")
  }));

  await Listing.insertMany(listings);
  console.log("Database seeded successfully!");
};

initDB();
