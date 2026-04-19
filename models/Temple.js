const mongoose = require('mongoose');

const TempleSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String },
  location:    { type: String },
  city:        { type: String },
  state:       { type: String },
  image:       { type: String },
  isActive:    { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Temple', TempleSchema);
