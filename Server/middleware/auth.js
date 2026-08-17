const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_for_development_only';

// Middleware to verify a valid JWT token exists
const verifyToken = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: 'Access Denied: No token provided' });

    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid or Expired Token' });
  }
};

const verifyAdminToken = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) return res.status(401).json({ message: 'Access Denied: No token provided' });

    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;

    const allowedRoles = ['admin', 'franchise', 'channel'];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access Denied: Admin privileges required' });
    }

    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid or Expired Token' });
  }
};

module.exports = { verifyToken, verifyAdminToken };
