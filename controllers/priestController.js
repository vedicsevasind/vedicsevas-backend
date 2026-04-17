const Priest = require('../models/Priest');

exports.getAllPriests = async (req, res) => {
  try {
    const priests = await Priest.find({ isActive: true }).sort({ rating: -1 });
    res.json({ success: true, count: priests.length, data: priests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getPriestById = async (req, res) => {
  try {
    const priest = await Priest.findById(req.params.id);
    if (!priest) return res.status(404).json({ success: false, message: 'Priest not found' });
    res.json({ success: true, data: priest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createPriest = async (req, res) => {
  try {
    const priest = await Priest.create(req.body);
    res.status(201).json({ success: true, data: priest });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updatePriest = async (req, res) => {
  try {
    const priest = await Priest.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!priest) return res.status(404).json({ success: false, message: 'Priest not found' });
    res.json({ success: true, data: priest });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updatePriestDates = async (req, res) => {
  try {
    const priest = await Priest.findByIdAndUpdate(
      req.params.id,
      { availableDates: req.body.availableDates },
      { new: true }
    );
    res.json({ success: true, message: 'Priest dates updated', data: priest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deletePriest = async (req, res) => {
  try {
    await Priest.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Priest deactivated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};