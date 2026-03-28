\// Authentication middleware
// Verifies the JWT token sent in the request header
// If valid, attaches the decoded user info to the request object
// This middleware is used to protect routes that require a logged in user

const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from the request header
  const token = req.header('x-auth-token');

  // If no token is found, deny access
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Verify the token using the JWT secret
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user data to the request
    next(); // Move on to the next middleware or route handler
  } catch (error) {
    // If token is invalid or expired, deny access
    res.status(401).json({ message: 'Token is not valid' });
  }
};