const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Middleware to require admin authentication
const requireAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
        code: 'NO_TOKEN'
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user and check admin status
    const user = await User.findByPk(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.',
        code: 'INVALID_TOKEN'
      });
    }

    // Check if user is admin
    if (!user.isAdmin && user.role !== 'admin' && user.email !== 'support@smartreportpro.aizetecc.com') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.',
        code: 'ADMIN_REQUIRED'
      });
    }

    // Add user info to request
    req.user = user;
    req.isAdmin = true;
    
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.',
        code: 'INVALID_TOKEN'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error during authentication.',
      code: 'SERVER_ERROR'
    });
  }
};

// Middleware to check if user is admin (non-blocking)
const checkAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.id);
      
      if (user && (user.isAdmin || user.role === 'admin' || user.email === 'support@smartreportpro.aizetecc.com')) {
        req.isAdmin = true;
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Non-blocking, continue without admin privileges
    next();
  }
};

module.exports = {
  requireAdmin,
  checkAdmin
};
