const express = require('express');
const router = express.Router();
const { getDashboard, getUsers, toggleUser, getAllBookings, updateBookingStatus, verifyPriest } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { adminAuth } = require('../middleware/adminAuth');

// All admin routes require auth + admin role
router.use(protect, adminAuth);

router.get('/dashboard', getDashboard);
router.get('/users', getUsers);
router.put('/users/:id/toggle', toggleUser);
router.get('/bookings', getAllBookings);
router.put('/bookings/:id/status', updateBookingStatus);
router.put('/priests/:id/verify', verifyPriest);

module.exports = router;
