const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes — only logged-in users can access
exports.protect = async (req, res, next) => {
  let token;

  // Check if Authorization header exists and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Extract the token part: "Bearer eyJhbGci..." → "eyJhbGci..."
    token = req.headers.authorization.split(' ')[1];
  }

  // If no token found, reject the request
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Please log in.'
    });
  }

  try {
    // Decode the token to get the user's ID
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user in database (exclude password field)
    req.user = await User.findById(decoded.id).select('-password');

    // Move on to the actual route handler
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token is invalid or expired. Please log in again.'
    });
  }
};

// Admin only — block non-admin users
exports.adminOnly = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin only.'
    });
  }
  next();
};