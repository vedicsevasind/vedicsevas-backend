const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { protect } = require('../middleware/auth');
const { adminAuth } = require('../middleware/adminAuth');
const Puja = require('../models/Puja');
const Priest = require('../models/Priest');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer — store in memory, send to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files allowed'), false);
  }
});

// Helper: upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder, publicId) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, public_id: publicId, overwrite: true, resource_type: 'image' },
      (error, result) => { if (error) reject(error); else resolve(result); }
    );
    stream.end(buffer);
  });
};

// POST /api/upload/puja/:id  — upload puja image
router.post('/puja/:id', protect, adminAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const result = await uploadToCloudinary(req.file.buffer, 'vedicsevas/pujas', 'puja_' + req.params.id);
    await Puja.findByIdAndUpdate(req.params.id, { image: result.secure_url });
    res.json({ success: true, url: result.secure_url, message: 'Puja image updated!' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// POST /api/upload/priest/:id  — upload priest photo
router.post('/priest/:id', protect, adminAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const result = await uploadToCloudinary(req.file.buffer, 'vedicsevas/priests', 'priest_' + req.params.id);
    await Priest.findByIdAndUpdate(req.params.id, { image: result.secure_url });
    res.json({ success: true, url: result.secure_url, message: 'Priest photo updated!' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// POST /api/upload/banner  — upload banner image
router.post('/banner', protect, adminAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const { slot } = req.body; // banner1, banner2, banner3
    const result = await uploadToCloudinary(req.file.buffer, 'vedicsevas/banners', slot || 'banner_main');
    res.json({ success: true, url: result.secure_url, slot, message: 'Banner updated!' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// POST /api/upload/logo  — upload app logo
router.post('/logo', protect, adminAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const result = await uploadToCloudinary(req.file.buffer, 'vedicsevas', 'logo');
    res.json({ success: true, url: result.secure_url, message: 'Logo updated!' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// GET /api/upload/media  — get all uploaded media from Cloudinary
router.get('/media', protect, adminAuth, async (req, res) => {
  try {
    const [pujas, priests, banners] = await Promise.all([
      cloudinary.api.resources({ type: 'upload', prefix: 'vedicsevas/pujas', max_results: 50 }),
      cloudinary.api.resources({ type: 'upload', prefix: 'vedicsevas/priests', max_results: 50 }),
      cloudinary.api.resources({ type: 'upload', prefix: 'vedicsevas/banners', max_results: 10 }),
    ]);
    res.json({ success: true, data: { pujas: pujas.resources, priests: priests.resources, banners: banners.resources } });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// POST /api/upload/block-dates  — block dates for a puja
router.post('/block-dates/:pujaId', protect, adminAuth, async (req, res) => {
  try {
    const { blockedDates } = req.body;
    const puja = await Puja.findByIdAndUpdate(
      req.params.pujaId,
      { blockedDates },
      { new: true }
    );
    res.json({ success: true, data: puja, message: 'Blocked dates updated!' });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

module.exports = router;
