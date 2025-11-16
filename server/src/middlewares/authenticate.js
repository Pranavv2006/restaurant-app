const { verifyAccessToken } = require('../utils/jwtUtils');

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required',
      });
    }

    const token = authHeader.substring(7); 

    try {
      const decoded = verifyAccessToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Access token expired',
          code: 'TOKEN_EXPIRED',
        });
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Invalid access token',
          code: 'INVALID_TOKEN',
        });
      } else {
        return res.status(401).json({
          success: false,
          message: 'Token verification failed',
        });
      }
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication',
    });
  }
};

module.exports = { authenticate };