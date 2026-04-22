const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper: create a JWT token for a user
const generateToken = (id) => {
  return jwt.sign(
    { id },                          // Payload: what we store inside token
    process.env.JWT_SECRET,          // Secret key to sign it
    { expiresIn: process.env.JWT_EXPIRE }  // Expires in 30 days
  );
};

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    // Create new user (password gets hashed automatically by model)
    const user = await User.create({ name, email, password, phone });

    // Create token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user by email
    const user = await User.findOne({ email });

    // Check user exists and password matches
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/auth/me  (get currently logged-in user)
exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// PUT /api/auth/updateprofile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address, city, state } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, address, city, state },
      { new: true }  // Return the updated document
    ).select('-password');

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// POST /api/auth/google
exports.googleAuth = async (req, res) => {
  try {
    const { name, email, googleId, photo } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email required' });

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: name || 'VedicSevas User',
        email,
        password: googleId + '_google_auth_' + Date.now(),
        phone: '',
        isAdmin: false
      });
    }

    const token = generateToken(user._id);
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
