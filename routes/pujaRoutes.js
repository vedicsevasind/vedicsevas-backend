const express = require('express');
const router = express.Router();
const { getPujas, getPuja, createPuja, updatePuja, deletePuja } = require('../controllers/pujaController');
const { protect } = require('../middleware/auth');
const { adminAuth } = require('../middleware/adminAuth');

router.get('/', getPujas);
router.get('/:id', getPuja);
router.post('/', protect, adminAuth, createPuja);
router.put('/:id', protect, adminAuth, updatePuja);
router.delete('/:id', protect, adminAuth, deletePuja);

module.exports = router;
