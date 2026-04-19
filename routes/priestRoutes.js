const express = require('express');
const router = express.Router();
const { getAllPriests, getPriestById, createPriest, updatePriest, updatePriestDates, deletePriest } = require('../controllers/priestController');
const { protect } = require('../middleware/auth');
const { adminAuth } = require('../middleware/adminAuth');

router.get('/', getAllPriests);
router.get('/:id', getPriestById);
router.post('/', protect, adminAuth, createPriest);
router.put('/:id', protect, adminAuth, updatePriest);
router.put('/:id/dates', protect, adminAuth, updatePriestDates);
router.delete('/:id', protect, adminAuth, deletePriest);

module.exports = router;
