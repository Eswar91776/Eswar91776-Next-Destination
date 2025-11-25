const mongoose = require('mongoose');
const Listing = require('../models/listing');
const { data } = require('./data');

main()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/nextdestinationDB');
}

const initDB = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(data);
  console.log("Database seeded successfully!");
};

initDB();
