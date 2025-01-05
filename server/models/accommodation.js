const mongoose = require('mongoose');

const AccommodationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Accommodation', AccommodationSchema);
