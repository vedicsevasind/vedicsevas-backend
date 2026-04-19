const mongoose = require('mongoose');

const PujaSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String },
  price:       { type: Number, required: true },
  duration:    { type: String },
  image:       { type: String },
  category:    { type: String },
  isActive:    { type: Boolean, default: true },
  availableDates: [{ type: Date }]
}, { timestamps: true });

module.exports = mongoose.model('Puja', PujaSchema);
