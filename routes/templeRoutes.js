const express = require('express');
const router = express.Router();
const { getTemples, getTemple, createTemple, updateTemple } = require('../controllers/templeController');
const { protect } = require('../middleware/auth');
const { adminAuth } = require('../middleware/adminAuth');

router.get('/', getTemples);
router.get('/:id', getTemple);
router.post('/', protect, adminAuth, createTemple);
router.put('/:id', protect, adminAuth, updateTemple);

module.exports = router;
