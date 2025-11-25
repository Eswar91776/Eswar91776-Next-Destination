const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const listingSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: {
    filename: { type: String, default: 'listingimage' },
    url: {
      type: String,
      default: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
      set: (v) => v === '' ? "https://images.unsplash.com/photo-1600585154340-be6161a56a0c" : v
    }
  },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  country: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: 'Review'
  }]
});

listingSchema.post('findOneAndDelete', async(listing) => {
  if(listing){
    await Review.deleteMany({_id: {$in: listing.reviews}});
  }
  
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
