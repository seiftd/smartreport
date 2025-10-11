const express = require('express');
const { body, validationResult } = require('express-validator');
const { verifyIdToken, getUserByUid, setCustomUserClaims } = require('../config/firebase');
const { generateJWT } = require('../utils/jwt');
const { createUser, getUserByEmail, updateUser } = require('../services/userService');
const { errorHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Firebase OAuth callback
router.post('/firebase', [
  body('idToken').notEmpty().withMessage('ID token is required')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { idToken } = req.body;

    // Verify Firebase ID token
    const decodedToken = await verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    // Check if user exists in our database
    let user = await getUserByEmail(email);
    
    if (!user) {
      // Create new user
      user = await createUser({
        firebaseUid: uid,
        email,
        name: name || email.split('@')[0],
        avatar: picture,
        provider: 'firebase',
        isEmailVerified: true
      });
    } else {
      // Update existing user with Firebase UID if not set
      if (!user.firebaseUid) {
        user = await updateUser(user.id, { firebaseUid: uid });
      }
    }

    // Set custom claims for subscription status
    await setCustomUserClaims(uid, {
      userId: user.id,
      plan: user.plan || 'free',
      subscriptionStatus: user.subscriptionStatus || 'active'
    });

    // Generate JWT token
    const token = generateJWT({
      userId: user.id,
      email: user.email,
      plan: user.plan
    });

    res.json({
      success: true,
      message: 'Authentication successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        plan: user.plan,
        subscriptionStatus: user.subscriptionStatus
      },
      token
    });

  } catch (error) {
    next(error);
  }
});

// Refresh token
router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({
        error: 'Refresh token is required'
      });
    }

    // Verify refresh token and generate new access token
    // Implementation depends on your refresh token strategy
    
    res.json({
      success: true,
      message: 'Token refreshed successfully'
    });

  } catch (error) {
    next(error);
  }
});

// Logout
router.post('/logout', async (req, res, next) => {
  try {
    // In a real implementation, you might want to blacklist the token
    // For now, we'll just return success
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    next(error);
  }
});

// Get current user info
router.get('/me', async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await getUserByEmail(req.user.email);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        plan: user.plan,
        subscriptionStatus: user.subscriptionStatus,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
