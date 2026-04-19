const express = require('express');
const router = express.Router();
const { getAllPujas, getPujaById, createPuja, updatePuja, deletePuja, updatePujaAvailableDates } = require('../controllers/pujaController');
const { protect } = require('../middleware/auth');
const { adminAuth } = require('../middleware/adminAuth');

router.get('/', getAllPujas);
router.get('/:id', getPujaById);
router.post('/', protect, adminAuth, createPuja);
router.put('/:id', protect, adminAuth, updatePuja);
router.put('/:id/dates', protect, adminAuth, updatePujaAvailableDates);
router.delete('/:id', protect, adminAuth, deletePuja);

module.exports = router;
