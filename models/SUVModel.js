const mongoose = require('mongoose');

const SUVSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  imagePath: String,
  year: Number,
  brand: String,
  fuelType: String,
});

module.exports = mongoose.model('SUV', SUVSchema);
