const Puja = require('../models/Puja');

// GET /api/pujas  — get all active pujas
exports.getAllPujas = async (req, res) => {
  try {
    // Only return active pujas, sorted newest first
    const pujas = await Puja.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, count: pujas.length, data: pujas });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/pujas/:id  — get one puja by its ID
exports.getPujaById = async (req, res) => {
  try {
    const puja = await Puja.findById(req.params.id);
    if (!puja) {
      return res.status(404).json({ success: false, message: 'Puja not found' });
    }
    res.json({ success: true, data: puja });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/pujas  — create a new puja (admin only)
exports.createPuja = async (req, res) => {
  try {
    const puja = await Puja.create(req.body);
    res.status(201).json({ success: true, data: puja });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/pujas/:id  — update a puja (admin only)
exports.updatePuja = async (req, res) => {
  try {
    const puja = await Puja.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!puja) {
      return res.status(404).json({ success: false, message: 'Puja not found' });
    }
    res.json({ success: true, data: puja });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/pujas/:id/dates  — update ONLY the available dates (admin only)
// This is the KEY feature: admin changes dates → app shows updated dates instantly
exports.updatePujaAvailableDates = async (req, res) => {
  try {
    const { availableDates } = req.body;

    const puja = await Puja.findByIdAndUpdate(
      req.params.id,
      { availableDates },  // Only update this field
      { new: true }
    );
    if (!puja) {
      return res.status(404).json({ success: false, message: 'Puja not found' });
    }
    res.json({
      success: true,
      message: 'Available dates updated successfully',
      data: puja
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/pujas/:id  — deactivate a puja (admin only, soft delete)
exports.deletePuja = async (req, res) => {
  try {
    await Puja.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Puja deactivated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};