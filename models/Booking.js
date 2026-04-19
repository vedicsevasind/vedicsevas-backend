const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  puja:      { type: mongoose.Schema.Types.ObjectId, ref: 'Puja', required: true },
  temple:    { type: mongoose.Schema.Types.ObjectId, ref: 'Temple' },
  priest:    { type: mongoose.Schema.Types.ObjectId, ref: 'Priest' },
  date:      { type: Date, required: true },
  amount:    { type: Number, required: true },
  status:    { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  paymentId: { type: String },
  orderId:   { type: String },
  notes:     { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
