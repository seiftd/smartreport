// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error occurred:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Default error response
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let error = 'Internal Server Error';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    error = 'Validation Error';
    message = err.message;
  } else if (err.name === 'CastError') {
    statusCode = 400;
    error = 'Invalid ID';
    message = 'Invalid ID format';
  } else if (err.name === 'MongoError' && err.code === 11000) {
    statusCode = 409;
    error = 'Duplicate Entry';
    message = 'Resource already exists';
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    error = 'Invalid Token';
    message = 'Invalid authentication token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    error = 'Token Expired';
    message = 'Authentication token has expired';
  } else if (err.name === 'MulterError') {
    statusCode = 400;
    error = 'File Upload Error';
    message = err.message;
  } else if (err.code === 'LIMIT_FILE_SIZE') {
    statusCode = 413;
    error = 'File Too Large';
    message = 'File size exceeds the maximum allowed limit';
  } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    statusCode = 400;
    error = 'Unexpected File';
    message = 'Unexpected file field';
  }

  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Internal server error';
  }

  // Send error response
  res.status(statusCode).json({
    error,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details: err
    })
  });
};

// Async error wrapper
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// 404 handler
const notFound = (req, res, next) => {
  const error = new AppError(`Not found - ${req.originalUrl}`, 404);
  next(error);
};

module.exports = {
  errorHandler,
  asyncHandler,
  AppError,
  notFound
};
