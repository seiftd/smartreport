const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Generate JWT token
const generateJWT = (payload) => {
  try {
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'smartreport-pro',
      audience: 'smartreport-pro-users'
    });
    
    return token;
  } catch (error) {
    console.error('❌ Failed to generate JWT:', error);
    throw new Error('Failed to generate authentication token');
  }
};

// Verify JWT token
const verifyJWT = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'smartreport-pro',
      audience: 'smartreport-pro-users'
    });
    
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    } else {
      throw new Error('Token verification failed');
    }
  }
};

// Generate refresh token
const generateRefreshToken = (payload) => {
  try {
    const refreshToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: '30d',
      issuer: 'smartreport-pro',
      audience: 'smartreport-pro-refresh'
    });
    
    return refreshToken;
  } catch (error) {
    console.error('❌ Failed to generate refresh token:', error);
    throw new Error('Failed to generate refresh token');
  }
};

// Verify refresh token
const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'smartreport-pro',
      audience: 'smartreport-pro-refresh'
    });
    
    return decoded;
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Refresh token has expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid refresh token');
    } else {
      throw new Error('Refresh token verification failed');
    }
  }
};

// Extract token from Authorization header
const extractToken = (authHeader) => {
  if (!authHeader) {
    return null;
  }
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
};

module.exports = {
  generateJWT,
  verifyJWT,
  generateRefreshToken,
  verifyRefreshToken,
  extractToken
};
