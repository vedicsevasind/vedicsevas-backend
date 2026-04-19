const express = require('express');
const router = express.Router();
const { getAllTemples, getTempleById, createTemple, updateTemple, updateTempleDates, deleteTemple } = require('../controllers/templeController');
const { protect } = require('../middleware/auth');
const { adminAuth } = require('../middleware/adminAuth');

router.get('/', getAllTemples);
router.get('/:id', getTempleById);
router.post('/', protect, adminAuth, createTemple);
router.put('/:id', protect, adminAuth, updateTemple);
router.put('/:id/dates', protect, adminAuth, updateTempleDates);
router.delete('/:id', protect, adminAuth, deleteTemple);

module.exports = router;
