const express = require('express');
const lemonSqueezy = require('../config/lemonsqueezy');
const { updateUser, getUserByEmail } = require('../services/userService');
const { errorHandler } = require('../middleware/errorHandler');

const router = express.Router();

// Lemon Squeezy webhook handler
router.post('/lemonsqueezy', express.raw({ type: 'application/json' }), async (req, res, next) => {
  try {
    const signature = req.headers['x-signature'];
    const payload = req.body;

    // Verify webhook signature
    if (!lemonSqueezy.verifyWebhookSignature(payload, signature)) {
      return res.status(401).json({
        error: 'Invalid webhook signature'
      });
    }

    const event = JSON.parse(payload);
    const { data, meta } = event;

    console.log('🔔 Lemon Squeezy webhook received:', meta.event_name);

    switch (meta.event_name) {
      case 'order_created':
        await handleOrderCreated(data);
        break;
      
      case 'subscription_created':
        await handleSubscriptionCreated(data);
        break;
      
      case 'subscription_updated':
        await handleSubscriptionUpdated(data);
        break;
      
      case 'subscription_cancelled':
        await handleSubscriptionCancelled(data);
        break;
      
      case 'subscription_resumed':
        await handleSubscriptionResumed(data);
        break;
      
      case 'subscription_expired':
        await handleSubscriptionExpired(data);
        break;
      
      default:
        console.log('🤷‍♂️ Unhandled webhook event:', meta.event_name);
    }

    res.status(200).json({ success: true });

  } catch (error) {
    console.error('❌ Webhook processing failed:', error);
    next(error);
  }
});

// Handle order created
async function handleOrderCreated(data) {
  try {
    const { attributes } = data;
    const { customer_email, custom_data } = attributes;
    
    if (custom_data && custom_data.userId) {
      // Update user with order information
      await updateUser(custom_data.userId, {
        lastOrderId: data.id,
        lastOrderDate: new Date().toISOString()
      });
      
      console.log('✅ Order created for user:', custom_data.userId);
    }
  } catch (error) {
    console.error('❌ Failed to handle order created:', error);
  }
}

// Handle subscription created
async function handleSubscriptionCreated(data) {
  try {
    const { attributes } = data;
    const { customer_email, custom_data } = attributes;
    
    if (custom_data && custom_data.userId) {
      // Update user with subscription information
      await updateUser(custom_data.userId, {
        subscriptionId: data.id,
        subscriptionStatus: 'active',
        plan: getPlanFromVariant(attributes.variant_id),
        subscriptionStartDate: new Date().toISOString()
      });
      
      console.log('✅ Subscription created for user:', custom_data.userId);
    }
  } catch (error) {
    console.error('❌ Failed to handle subscription created:', error);
  }
}

// Handle subscription updated
async function handleSubscriptionUpdated(data) {
  try {
    const { attributes } = data;
    const subscriptionId = data.id;
    
    // Find user by subscription ID
    const user = await getUserBySubscriptionId(subscriptionId);
    
    if (user) {
      await updateUser(user.id, {
        subscriptionStatus: attributes.status,
        plan: getPlanFromVariant(attributes.variant_id)
      });
      
      console.log('✅ Subscription updated for user:', user.id);
    }
  } catch (error) {
    console.error('❌ Failed to handle subscription updated:', error);
  }
}

// Handle subscription cancelled
async function handleSubscriptionCancelled(data) {
  try {
    const subscriptionId = data.id;
    
    // Find user by subscription ID
    const user = await getUserBySubscriptionId(subscriptionId);
    
    if (user) {
      await updateUser(user.id, {
        subscriptionStatus: 'cancelled',
        plan: 'free',
        subscriptionEndDate: new Date().toISOString()
      });
      
      console.log('✅ Subscription cancelled for user:', user.id);
    }
  } catch (error) {
    console.error('❌ Failed to handle subscription cancelled:', error);
  }
}

// Handle subscription resumed
async function handleSubscriptionResumed(data) {
  try {
    const subscriptionId = data.id;
    
    // Find user by subscription ID
    const user = await getUserBySubscriptionId(subscriptionId);
    
    if (user) {
      await updateUser(user.id, {
        subscriptionStatus: 'active',
        plan: getPlanFromVariant(data.attributes.variant_id)
      });
      
      console.log('✅ Subscription resumed for user:', user.id);
    }
  } catch (error) {
    console.error('❌ Failed to handle subscription resumed:', error);
  }
}

// Handle subscription expired
async function handleSubscriptionExpired(data) {
  try {
    const subscriptionId = data.id;
    
    // Find user by subscription ID
    const user = await getUserBySubscriptionId(subscriptionId);
    
    if (user) {
      await updateUser(user.id, {
        subscriptionStatus: 'expired',
        plan: 'free',
        subscriptionEndDate: new Date().toISOString()
      });
      
      console.log('✅ Subscription expired for user:', user.id);
    }
  } catch (error) {
    console.error('❌ Failed to handle subscription expired:', error);
  }
}

// Helper function to get plan from variant ID
function getPlanFromVariant(variantId) {
  // Map variant IDs to plan names
  const variantToPlan = {
    'variant_123': 'pro',
    'variant_456': 'business',
    // Add more mappings as needed
  };
  
  return variantToPlan[variantId] || 'free';
}

// Helper function to get user by subscription ID
async function getUserBySubscriptionId(subscriptionId) {
  // This would query your database for a user with the given subscription ID
  // Implementation depends on your database setup
  return null; // Placeholder
}

module.exports = router;
