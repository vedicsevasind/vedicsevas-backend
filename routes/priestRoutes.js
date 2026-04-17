const express = require('express');
const router = express.Router();
const { getPriests, getPriest, createPriest, updatePriest, getPriestAvailability } = require('../controllers/priestController');
const { protect } = require('../middleware/auth');
const { adminAuth } = require('../middleware/adminAuth');

router.get('/', getPriests);
router.get('/:id', getPriest);
router.get('/:id/availability', getPriestAvailability);
router.post('/', protect, adminAuth, createPriest);
router.put('/:id', protect, adminAuth, updatePriest);

module.exports = router;
