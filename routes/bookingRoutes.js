const express = require('express');
const router = express.Router();
const { createOrder, createBooking, verifyPayment, getMyBookings, getAllBookings, updateBookingStatus } = require('../controllers/bookingController');
const { protect } = require('../middleware/auth');
const { adminAuth } = require('../middleware/adminAuth');

router.post('/create-order', protect, createOrder);
router.post('/create', protect, createBooking);
router.post('/verify-payment', protect, verifyPayment);
router.get('/my', protect, getMyBookings);
router.get('/all', protect, adminAuth, getAllBookings);
router.put('/:id/status', protect, adminAuth, updateBookingStatus);

module.exports = router;
