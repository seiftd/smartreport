const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { requireAdmin } = require('../middleware/admin');

const router = express.Router();

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Check if email is admin email
    if (email !== 'support@smartreportpro.aizetecc.com') {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    // Check password (hardcoded for now)
    if (password !== 'letmein') {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    // Find or create admin user
    let adminUser = await User.findOne({ where: { email } });
    
    if (!adminUser) {
      // Create admin user if doesn't exist
      adminUser = await User.create({
        email: 'support@smartreportpro.aizetecc.com',
        name: 'Admin User',
        firebaseUid: 'admin-' + Date.now(),
        isAdmin: true,
        role: 'admin',
        isEmailVerified: true
      });
    } else {
      // Update existing user to admin
      await adminUser.update({
        isAdmin: true,
        role: 'admin'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: adminUser.id, 
        email: adminUser.email, 
        isAdmin: true,
        role: 'admin'
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      token,
      user: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        isAdmin: true,
        role: 'admin'
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during admin login'
    });
  }
});

// Verify admin token
router.get('/verify', requireAdmin, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Admin token is valid',
    user: {
      id: req.user.id,
      email: req.user.email,
      name: req.user.name,
      isAdmin: req.user.isAdmin,
      role: req.user.role
    }
  });
});

// Admin logout (client-side token removal)
router.post('/logout', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Admin logout successful'
  });
});

module.exports = router;
