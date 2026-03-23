// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 1. Protect Routes (Check if user is logged in)
exports.protect = async (req, res, next) => {
  let token;

  // Check for token in headers (Standard: "Bearer <token>")
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the ID in the token & attach to request
      req.user = await User.findById(decoded.id);

      next(); // Pass control to the next function
    } catch (error) {
      console.error(error);
      res.status(401).json({ success: false, error: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, error: 'Not authorized, no token' });
  }
};

// 2. Grant Access to Specific Roles (RBAC)
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // "Lead Developer" Bypass (God Mode)
    if (req.user.role === 'Lead Developer') {
      return next();
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        error: `User role '${req.user.role}' is not authorized to access this route` 
      });
    }
    next();
  };
};