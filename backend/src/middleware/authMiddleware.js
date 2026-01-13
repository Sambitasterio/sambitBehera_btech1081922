const supabase = require('../config/supabaseClient');

/**
 * Middleware to verify Bearer token and authenticate user
 * Extracts token from Authorization header and verifies it with Supabase
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Extract Bearer token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing or invalid Authorization header. Expected format: Bearer <token>'
      });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.substring(7);

    if (!token) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Token is missing'
      });
    }

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token'
      });
    }

    // Attach user to request object for use in route handlers
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication failed'
    });
  }
};

module.exports = authMiddleware;
