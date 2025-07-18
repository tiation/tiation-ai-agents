const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'No token provided'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Get user from database
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'User not found'
      });
    }
    
    // Check if user account is locked
    if (user.isLocked) {
      return res.status(423).json({
        error: 'Account locked',
        message: 'Account is temporarily locked due to multiple failed login attempts'
      });
    }
    
    // Check if user's subscription is active
    if (user.subscription.status !== 'active') {
      return res.status(403).json({
        error: 'Subscription inactive',
        message: 'Your subscription is not active. Please update your billing information.'
      });
    }
    
    // Reset monthly usage if needed
    await user.resetMonthlyUsage();
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Invalid token',
        message: 'The provided token is invalid'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expired',
        message: 'The provided token has expired'
      });
    }
    
    return res.status(500).json({
      error: 'Authentication failed',
      message: 'Internal server error during authentication'
    });
  }
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Access denied',
      message: 'Admin access required'
    });
  }
  next();
};

// Middleware to check if user is enterprise tier
const requireEnterprise = (req, res, next) => {
  if (req.user.subscription.tier !== 'enterprise' && req.user.role !== 'admin') {
    return res.status(403).json({
      error: 'Access denied',
      message: 'Enterprise subscription required'
    });
  }
  next();
};

// Middleware to check subscription limits
const checkLimit = (limitType) => {
  return (req, res, next) => {
    if (!req.user.checkLimit(limitType)) {
      const limits = {
        free: {
          agentsCreated: 3,
          monthlyApiCalls: 1000,
          storageUsed: 100
        },
        pro: {
          agentsCreated: 50,
          monthlyApiCalls: 50000,
          storageUsed: 1000
        },
        enterprise: {
          agentsCreated: 'Unlimited',
          monthlyApiCalls: 'Unlimited',
          storageUsed: 'Unlimited'
        }
      };
      
      const userLimits = limits[req.user.subscription.tier];
      
      return res.status(403).json({
        error: 'Limit exceeded',
        message: `You have reached your ${limitType} limit of ${userLimits[limitType]} for the ${req.user.subscription.tier} plan`,
        currentUsage: req.user.usage[limitType],
        limit: userLimits[limitType],
        upgradeUrl: `${process.env.FRONTEND_URL}/upgrade`
      });
    }
    next();
  };
};

// Middleware to verify API key (for agent interactions)
const verifyApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'] || req.query.apiKey;
    
    if (!apiKey) {
      return res.status(401).json({
        error: 'API key required',
        message: 'Please provide a valid API key'
      });
    }
    
    // Find agent by API key
    const Agent = require('../models/Agent');
    const agent = await Agent.findOne({ 'deployment.apiKey': apiKey })
      .populate('owner', 'email subscription');
    
    if (!agent) {
      return res.status(401).json({
        error: 'Invalid API key',
        message: 'The provided API key is not valid'
      });
    }
    
    // Check if agent is deployed and active
    if (!agent.deployment.isDeployed || agent.status !== 'active') {
      return res.status(403).json({
        error: 'Agent not available',
        message: 'The agent is not currently active or deployed'
      });
    }
    
    // Check rate limiting
    if (agent.deployment.rateLimiting.enabled) {
      // This is a simplified rate limit check
      // In production, you'd use Redis or similar for proper rate limiting
      const now = Date.now();
      const oneMinuteAgo = now - 60000;
      const oneHourAgo = now - 3600000;
      
      // You'd implement proper rate limiting logic here
      // For now, we'll just pass through
    }
    
    req.agent = agent;
    req.user = agent.owner;
    next();
  } catch (error) {
    console.error('API key verification error:', error);
    return res.status(500).json({
      error: 'Verification failed',
      message: 'Internal server error during API key verification'
    });
  }
};

// Middleware to log API usage
const logApiUsage = async (req, res, next) => {
  const startTime = Date.now();
  
  // Override res.json to capture response
  const originalJson = res.json;
  res.json = function(data) {
    const responseTime = Date.now() - startTime;
    const isSuccessful = res.statusCode < 400;
    
    // Log the usage asynchronously
    setImmediate(async () => {
      try {
        if (req.user) {
          // Update user's API call count
          req.user.usage.apiCalls += 1;
          req.user.usage.monthlyApiCalls += 1;
          await req.user.save();
        }
        
        if (req.agent) {
          // Update agent's performance metrics
          await req.agent.updatePerformance(responseTime, isSuccessful);
        }
      } catch (error) {
        console.error('Error logging API usage:', error);
      }
    });
    
    return originalJson.call(this, data);
  };
  
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireEnterprise,
  checkLimit,
  verifyApiKey,
  logApiUsage
};
