const Temple = require('../models/Temple');

exports.getAllTemples = async (req, res) => {
  try {
    const temples = await Temple.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, count: temples.length, data: temples });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTempleById = async (req, res) => {
  try {
    const temple = await Temple.findById(req.params.id);
    if (!temple) return res.status(404).json({ success: false, message: 'Temple not found' });
    res.json({ success: true, data: temple });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createTemple = async (req, res) => {
  try {
    const temple = await Temple.create(req.body);
    res.status(201).json({ success: true, data: temple });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateTemple = async (req, res) => {
  try {
    const temple = await Temple.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!temple) return res.status(404).json({ success: false, message: 'Temple not found' });
    res.json({ success: true, data: temple });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateTempleDates = async (req, res) => {
  try {
    const temple = await Temple.findByIdAndUpdate(
      req.params.id,
      { availableDates: req.body.availableDates },
      { new: true }
    );
    res.json({ success: true, message: 'Temple dates updated', data: temple });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteTemple = async (req, res) => {
  try {
    await Temple.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Temple deactivated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};