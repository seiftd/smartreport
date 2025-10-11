const { Subscription } = require('../models');

// Middleware to check if user has active subscription
const requireActiveSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({
      where: { userId: req.user.id }
    });

    if (!subscription || !subscription.isActive() || subscription.isExpired()) {
      return res.status(403).json({
        success: false,
        message: 'Active subscription required',
        code: 'SUBSCRIPTION_REQUIRED'
      });
    }

    req.subscription = subscription;
    next();
  } catch (error) {
    console.error('Subscription check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check subscription'
    });
  }
};

// Middleware to check specific feature access
const requireFeature = (feature) => {
  return async (req, res, next) => {
    try {
      const subscription = await Subscription.findOne({
        where: { userId: req.user.id }
      });

      if (!subscription || !subscription.isActive() || subscription.isExpired()) {
        return res.status(403).json({
          success: false,
          message: 'Active subscription required',
          code: 'SUBSCRIPTION_REQUIRED'
        });
      }

      if (!subscription.hasFeature(feature)) {
        return res.status(403).json({
          success: false,
          message: `Feature '${feature}' not available in your plan`,
          code: 'FEATURE_NOT_AVAILABLE',
          requiredPlan: getRequiredPlanForFeature(feature)
        });
      }

      req.subscription = subscription;
      next();
    } catch (error) {
      console.error('Feature check error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to check feature access'
      });
    }
  };
};

// Middleware to check usage limits
const checkUsageLimit = (feature) => {
  return async (req, res, next) => {
    try {
      const subscription = await Subscription.findOne({
        where: { userId: req.user.id }
      });

      if (!subscription || !subscription.isActive() || subscription.isExpired()) {
        return res.status(403).json({
          success: false,
          message: 'Active subscription required',
          code: 'SUBSCRIPTION_REQUIRED'
        });
      }

      const currentUsage = subscription.usage[feature] || 0;
      const limit = subscription.features[feature];

      if (limit !== -1 && currentUsage >= limit) {
        return res.status(429).json({
          success: false,
          message: `Usage limit exceeded for ${feature}`,
          code: 'USAGE_LIMIT_EXCEEDED',
          currentUsage,
          limit
        });
      }

      req.subscription = subscription;
      next();
    } catch (error) {
      console.error('Usage limit check error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to check usage limits'
      });
    }
  };
};

// Middleware to check plan level
const requirePlan = (requiredPlan) => {
  return async (req, res, next) => {
    try {
      const subscription = await Subscription.findOne({
        where: { userId: req.user.id }
      });

      if (!subscription || !subscription.isActive() || subscription.isExpired()) {
        return res.status(403).json({
          success: false,
          message: 'Active subscription required',
          code: 'SUBSCRIPTION_REQUIRED'
        });
      }

      const planLevels = {
        'Free': 0,
        'Pro': 1,
        'For Growing Businesses': 2,
        'Enterprise': 3
      };

      const userPlanLevel = planLevels[subscription.plan] || 0;
      const requiredPlanLevel = planLevels[requiredPlan] || 0;

      if (userPlanLevel < requiredPlanLevel) {
        return res.status(403).json({
          success: false,
          message: `Plan '${requiredPlan}' or higher required`,
          code: 'INSUFFICIENT_PLAN',
          currentPlan: subscription.plan,
          requiredPlan
        });
      }

      req.subscription = subscription;
      next();
    } catch (error) {
      console.error('Plan check error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to check plan level'
      });
    }
  };
};

// Helper function to get required plan for feature
function getRequiredPlanForFeature(feature) {
  const featurePlans = {
    'apiAccess': 'Pro',
    'customBranding': 'Pro',
    'advancedAnalytics': 'Pro',
    'prioritySupport': 'For Growing Businesses',
    'teamMembers': 'For Growing Businesses'
  };

  return featurePlans[feature] || 'Pro';
}

// Middleware to add subscription info to response
const addSubscriptionInfo = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({
      where: { userId: req.user.id }
    });

    if (subscription) {
      res.locals.subscription = subscription;
    }

    next();
  } catch (error) {
    console.error('Error adding subscription info:', error);
    next();
  }
};

module.exports = {
  requireActiveSubscription,
  requireFeature,
  checkUsageLimit,
  requirePlan,
  addSubscriptionInfo
};
