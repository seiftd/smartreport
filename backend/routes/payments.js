const express = require('express');
const { body, validationResult } = require('express-validator');
const lemonSqueezy = require('../config/lemonsqueezy');
const { updateUser } = require('../services/userService');
const { errorHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Create checkout session
router.post('/checkout', [
  body('variantId').notEmpty().withMessage('Variant ID is required'),
  body('email').isEmail().withMessage('Valid email is required')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { variantId, email } = req.body;
    const userId = req.user.userId;

    // Create checkout session with Lemon Squeezy
    const checkout = await lemonSqueezy.createCheckout(variantId, email, {
      userId: userId,
      userEmail: email
    });

    res.json({
      success: true,
      checkoutUrl: checkout.data.attributes.url,
      checkoutId: checkout.data.id
    });

  } catch (error) {
    next(error);
  }
});

// Get subscription details
router.get('/subscription/:subscriptionId', async (req, res, next) => {
  try {
    const { subscriptionId } = req.params;
    
    const subscription = await lemonSqueezy.getSubscription(subscriptionId);
    
    res.json({
      success: true,
      subscription: subscription.data
    });

  } catch (error) {
    next(error);
  }
});

// Cancel subscription
router.post('/subscription/:subscriptionId/cancel', async (req, res, next) => {
  try {
    const { subscriptionId } = req.params;
    const userId = req.user.userId;
    
    // Cancel subscription in Lemon Squeezy
    await lemonSqueezy.cancelSubscription(subscriptionId);
    
    // Update user in database
    await updateUser(userId, {
      subscriptionStatus: 'cancelled',
      plan: 'free'
    });
    
    res.json({
      success: true,
      message: 'Subscription cancelled successfully'
    });

  } catch (error) {
    next(error);
  }
});

// Get available plans
router.get('/plans', async (req, res, next) => {
  try {
    const products = await lemonSqueezy.getProducts();
    
    // Filter and format plans for frontend
    const plans = products.data.map(product => ({
      id: product.id,
      name: product.attributes.name,
      description: product.attributes.description,
      variants: product.relationships?.variants?.data || []
    }));

    res.json({
      success: true,
      plans
    });

  } catch (error) {
    next(error);
  }
});

// Get user's current subscription
router.get('/subscription', async (req, res, next) => {
  try {
    const userId = req.user.userId;
    
    // Get user from database to find subscription details
    const user = await getUserById(userId);
    
    if (!user.subscriptionId) {
      return res.json({
        success: true,
        subscription: null,
        plan: 'free'
      });
    }

    const subscription = await lemonSqueezy.getSubscription(user.subscriptionId);
    
    res.json({
      success: true,
      subscription: subscription.data,
      plan: user.plan
    });

  } catch (error) {
    next(error);
  }
});

// Update payment method (if supported by Lemon Squeezy)
router.post('/payment-method', async (req, res, next) => {
  try {
    // Lemon Squeezy handles payment methods through their dashboard
    // This endpoint could redirect to their customer portal
    
    res.json({
      success: true,
      message: 'Please update your payment method through the customer portal',
      portalUrl: 'https://app.lemonsqueezy.com/customer'
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
