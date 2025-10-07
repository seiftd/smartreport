const { verifyJWT, extractToken } = require('../utils/jwt');
const { getUserById } = require('../services/userService');

// Authenticate JWT token middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractToken(authHeader);
    
    if (!token) {
      return res.status(401).json({
        error: 'Access token required',
        message: 'Please provide a valid authentication token'
      });
    }
    
    // Verify JWT token
    const decoded = verifyJWT(token);
    
    // Get user from database to ensure they still exist
    const user = await getUserById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        error: 'User not found',
        message: 'User account no longer exists'
      });
    }
    
    // Add user info to request object
    req.user = {
      userId: user.id,
      email: user.email,
      plan: user.plan,
      subscriptionStatus: user.subscriptionStatus
    };
    
    next();
  } catch (error) {
    console.error('❌ Authentication failed:', error.message);
    
    if (error.message.includes('expired')) {
      return res.status(401).json({
        error: 'Token expired',
        message: 'Your session has expired. Please log in again.'
      });
    } else if (error.message.includes('Invalid')) {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'Invalid authentication token'
      });
    } else {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Unable to authenticate request'
      });
    }
  }
};

// Check if user has specific plan
const requirePlan = (requiredPlan) => {
  return (req, res, next) => {
    const userPlan = req.user.plan;
    
    const planHierarchy = {
      'free': 0,
      'pro': 1,
      'business': 2
    };
    
    const userPlanLevel = planHierarchy[userPlan] || 0;
    const requiredPlanLevel = planHierarchy[requiredPlan] || 0;
    
    if (userPlanLevel < requiredPlanLevel) {
      return res.status(403).json({
        error: 'Insufficient plan',
        message: `This feature requires a ${requiredPlan} plan or higher`,
        currentPlan: userPlan,
        requiredPlan: requiredPlan
      });
    }
    
    next();
  };
};

// Check if user has active subscription
const requireActiveSubscription = (req, res, next) => {
  const subscriptionStatus = req.user.subscriptionStatus;
  
  if (subscriptionStatus !== 'active') {
    return res.status(403).json({
      error: 'Subscription required',
      message: 'An active subscription is required for this feature',
      subscriptionStatus: subscriptionStatus
    });
  }
  
  next();
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractToken(authHeader);
    
    if (!token) {
      req.user = null;
      return next();
    }
    
    const decoded = verifyJWT(token);
    const user = await getUserById(decoded.userId);
    
    if (user) {
      req.user = {
        userId: user.id,
        email: user.email,
        plan: user.plan,
        subscriptionStatus: user.subscriptionStatus
      };
    } else {
      req.user = null;
    }
    
    next();
  } catch (error) {
    // For optional auth, we don't fail on token errors
    req.user = null;
    next();
  }
};

module.exports = {
  authenticateToken,
  requirePlan,
  requireActiveSubscription,
  optionalAuth
};
