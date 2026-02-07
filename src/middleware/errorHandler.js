  // create centralised error handling middleware

  const errorHandler = (err, req, res, next) => {
   

    // Default error response
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Server Error';

    // Log error for debugging
    console.error(err);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
      message = 'Resource not found';
      statusCode = 404;
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
      statusCode = 400;
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      message = messages.join(', ');
      statusCode = 400;
    }

    // JWT errors 401, means using an expired or invalid access token
    if (err.name === 'JsonWebTokenError') {
      message = 'Invalid token';
      statusCode = 401;
    }

    // 401 means using an expired or invalid access token
    if (err.name === 'TokenExpiredError') {
      message = 'Token expired';
      statusCode = 401;
    }

    res.status(statusCode || 500).json({
      success: false,
      error: message
    });
  };

  module.exports = errorHandler;