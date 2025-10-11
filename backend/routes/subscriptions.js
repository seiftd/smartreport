const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { Subscription } = require('../models');

// Get user's subscription
router.get('/', authenticateToken, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      where: { userId: req.user.id }
    });

    if (!subscription) {
      // Create default free subscription for new users
      const defaultSubscription = await Subscription.create({
        userId: req.user.id,
        plan: 'Free',
        status: 'trial',
        trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days trial
        features: Subscription.getPlanFeatures('Free')
      });

      return res.status(200).json({
        success: true,
        subscription: defaultSubscription
      });
    }

    // Check if subscription is expired
    if (subscription.isExpired()) {
      await subscription.update({
        status: 'expired'
      });
    }

    res.status(200).json({
      success: true,
      subscription
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription'
    });
  }
});

// Update subscription plan
router.put('/plan', authenticateToken, async (req, res) => {
  try {
    const { plan, paymentProvider, paymentId, subscriptionId } = req.body;

    if (!plan || !['Free', 'Pro', 'For Growing Businesses', 'Enterprise'].includes(plan)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan specified'
      });
    }

    const subscription = await Subscription.findOne({
      where: { userId: req.user.id }
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    const newFeatures = Subscription.getPlanFeatures(plan);
    const updateData = {
      plan,
      features: newFeatures,
      status: 'active'
    };

    // Add payment information if provided
    if (paymentProvider) updateData.paymentProvider = paymentProvider;
    if (paymentId) updateData.paymentId = paymentId;
    if (subscriptionId) updateData.subscriptionId = subscriptionId;

    // Set period dates for paid plans
    if (plan !== 'Free') {
      const now = new Date();
      updateData.currentPeriodStart = now;
      updateData.currentPeriodEnd = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days
    }

    await subscription.update(updateData);

    res.status(200).json({
      success: true,
      message: 'Subscription updated successfully',
      subscription
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update subscription'
    });
  }
});

// Cancel subscription
router.put('/cancel', authenticateToken, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      where: { userId: req.user.id }
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    await subscription.update({
      status: 'cancelled',
      cancelledAt: new Date()
    });

    res.status(200).json({
      success: true,
      message: 'Subscription cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel subscription'
    });
  }
});

// Get subscription usage
router.get('/usage', authenticateToken, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      where: { userId: req.user.id }
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    res.status(200).json({
      success: true,
      usage: subscription.usage,
      features: subscription.features
    });
  } catch (error) {
    console.error('Error fetching usage:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch usage'
    });
  }
});

// Update usage
router.put('/usage', authenticateToken, async (req, res) => {
  try {
    const { feature, increment = 1 } = req.body;

    const subscription = await Subscription.findOne({
      where: { userId: req.user.id }
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    const currentUsage = subscription.usage || {};
    const newUsage = {
      ...currentUsage,
      [feature]: (currentUsage[feature] || 0) + increment
    };

    await subscription.update({
      usage: newUsage
    });

    res.status(200).json({
      success: true,
      usage: newUsage
    });
  } catch (error) {
    console.error('Error updating usage:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update usage'
    });
  }
});

// Check feature access
router.post('/check-feature', authenticateToken, async (req, res) => {
  try {
    const { feature, currentUsage = 0 } = req.body;

    const subscription = await Subscription.findOne({
      where: { userId: req.user.id }
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    const hasAccess = subscription.canUseFeature(feature, currentUsage);

    res.status(200).json({
      success: true,
      hasAccess,
      feature,
      currentUsage,
      limit: subscription.features[feature] || 0
    });
  } catch (error) {
    console.error('Error checking feature access:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check feature access'
    });
  }
});

// PayPal webhook handler
router.post('/webhook/paypal', async (req, res) => {
  try {
    const { event_type, resource } = req.body;

    console.log('PayPal webhook received:', event_type);

    // Handle different PayPal events
    switch (event_type) {
      case 'BILLING.SUBSCRIPTION.ACTIVATED':
        await handleSubscriptionActivated(resource);
        break;
      case 'BILLING.SUBSCRIPTION.CANCELLED':
        await handleSubscriptionCancelled(resource);
        break;
      case 'BILLING.SUBSCRIPTION.EXPIRED':
        await handleSubscriptionExpired(resource);
        break;
      case 'PAYMENT.SALE.COMPLETED':
        await handlePaymentCompleted(resource);
        break;
      default:
        console.log('Unhandled PayPal event:', event_type);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('PayPal webhook error:', error);
    res.status(500).json({ success: false });
  }
});

// Helper functions for PayPal webhooks
async function handleSubscriptionActivated(resource) {
  try {
    const { id, plan_id, subscriber } = resource;
    
    // Find user by email
    const user = await User.findOne({
      where: { email: subscriber.email_address }
    });

    if (user) {
      const plan = getPlanFromPayPalPlanId(plan_id);
      await Subscription.upsert({
        userId: user.id,
        plan,
        status: 'active',
        paymentProvider: 'paypal',
        subscriptionId: id,
        features: Subscription.getPlanFeatures(plan)
      });
    }
  } catch (error) {
    console.error('Error handling subscription activation:', error);
  }
}

async function handleSubscriptionCancelled(resource) {
  try {
    const { id } = resource;
    
    const subscription = await Subscription.findOne({
      where: { subscriptionId: id }
    });

    if (subscription) {
      await subscription.update({
        status: 'cancelled',
        cancelledAt: new Date()
      });
    }
  } catch (error) {
    console.error('Error handling subscription cancellation:', error);
  }
}

async function handleSubscriptionExpired(resource) {
  try {
    const { id } = resource;
    
    const subscription = await Subscription.findOne({
      where: { subscriptionId: id }
    });

    if (subscription) {
      await subscription.update({
        status: 'expired'
      });
    }
  } catch (error) {
    console.error('Error handling subscription expiration:', error);
  }
}

async function handlePaymentCompleted(resource) {
  try {
    const { billing_agreement_id, amount } = resource;
    
    // Update subscription with payment info
    const subscription = await Subscription.findOne({
      where: { subscriptionId: billing_agreement_id }
    });

    if (subscription) {
      await subscription.update({
        paymentId: resource.id,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      });
    }
  } catch (error) {
    console.error('Error handling payment completion:', error);
  }
}

function getPlanFromPayPalPlanId(planId) {
  // Map PayPal plan IDs to your internal plan names
  const planMapping = {
    'P-1234567890': 'Pro',
    'P-0987654321': 'For Growing Businesses',
    'P-1122334455': 'Enterprise'
  };
  
  return planMapping[planId] || 'Pro';
}

module.exports = router;
