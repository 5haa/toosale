const jwt = require('jsonwebtoken');
const { query } = require('../config/database');

// Verify JWT token middleware
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token format.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const result = await query(
      'SELECT id, first_name, last_name, email, role, created_at FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
    }

    // Add user to request object
    req.user = result.rows[0];
    req.userId = result.rows[0].id;
    
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.'
    });
  }
};

// Optional auth middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return next();
    }

    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      return next();
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const result = await query(
      'SELECT id, first_name, last_name, email, role, created_at FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (result.rows.length > 0) {
      req.user = result.rows[0];
      req.userId = result.rows[0].id;
    }
    
    next();
  } catch (error) {
    // Don't fail on optional auth errors, just continue without user
    next();
  }
};

// Check if user owns the store
const verifyStoreOwner = async (req, res, next) => {
  try {
    const storeId = req.params.storeId || req.body.storeId;
    
    if (!storeId) {
      return res.status(400).json({
        success: false,
        message: 'Store ID is required.'
      });
    }

    const result = await query(
      'SELECT id, user_id FROM stores WHERE id = $1',
      [storeId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Store not found.'
      });
    }

    if (result.rows[0].user_id !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not own this store.'
      });
    }

    req.store = result.rows[0];
    next();
  } catch (error) {
    console.error('Store ownership verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during store verification.'
    });
  }
};

// Check if user is admin
const verifyAdmin = async (req, res, next) => {
  try {
    // First verify the token
    await new Promise((resolve, reject) => {
      verifyToken(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Check if user has admin role
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    next();
  } catch (error) {
    console.error('Admin verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during admin verification.'
    });
  }
};

// Check if user is admin or the owner of the resource
const verifyAdminOrOwner = (resourceUserIdField = 'user_id') => {
  return async (req, res, next) => {
    try {
      // First verify the token
      await new Promise((resolve, reject) => {
        verifyToken(req, res, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      // If user is admin, allow access
      if (req.user && req.user.role === 'admin') {
        return next();
      }

      // If not admin, check if they own the resource
      const resourceUserId = req.body[resourceUserIdField] || req.params[resourceUserIdField] || req.query[resourceUserIdField];
      
      if (resourceUserId && parseInt(resourceUserId) === req.userId) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only access your own resources.'
      });

    } catch (error) {
      console.error('Admin or owner verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during authorization.'
      });
    }
  };
};

module.exports = {
  verifyToken,
  optionalAuth,
  verifyStoreOwner,
  verifyAdmin,
  verifyAdminOrOwner
};
