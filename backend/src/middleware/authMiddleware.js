const supabase = require('../config/supabaseClient');
const isConfigured = supabase.isConfigured;

/**
 * Middleware to verify Bearer token and authenticate user
 * Extracts token from Authorization header and verifies it with Supabase
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Check if Supabase is configured
    if (!isConfigured || !supabase) {
      return res.status(503).json({
        error: 'Service Unavailable',
        message: 'Supabase is not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file.'
      });
    }

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

    // Attach user and token to request object for use in route handlers
    req.user = user;
    req.token = token; // Attach token for use in controllers
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    // Handle specific error cases
    if (error.code === 'ENOTFOUND' || error.message?.includes('getaddrinfo')) {
      return res.status(503).json({
        error: 'Service Unavailable',
        message: 'Cannot connect to Supabase. Please check your SUPABASE_URL in the .env file.'
      });
    }
    
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication failed'
    });
  }
};

module.exports = authMiddleware;
