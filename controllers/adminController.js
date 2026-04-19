const User = require('../models/User');
const Booking = require('../models/Booking');
const Puja = require('../models/Puja');
const Priest = require('../models/Priest');

exports.getDashboard = async (req, res) => {
  try {
    const totalUsers    = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalPujas    = await Puja.countDocuments();
    const totalPriests  = await Priest.countDocuments();
    res.json({ success: true, data: { totalUsers, totalBookings, totalPujas, totalPriests } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.toggleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('puja', 'name price')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyPriest = async (req, res) => {
  try {
    const priest = await Priest.findByIdAndUpdate(
      req.params.id,
      { isVerified: true },
      { new: true }
    );
    if (!priest) return res.status(404).json({ success: false, message: 'Priest not found' });
    res.json({ success: true, data: priest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
