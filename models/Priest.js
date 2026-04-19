const mongoose = require('mongoose');

const PriestSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String },
  experience:  { type: Number },
  languages:   [{ type: String }],
  image:       { type: String },
  rating:      { type: Number, default: 0 },
  isActive:    { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Priest', PriestSchema);
