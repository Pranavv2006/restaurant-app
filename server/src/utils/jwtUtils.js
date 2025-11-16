const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_EXPIRY = '30m';
const REFRESH_TOKEN_EXPIRY = '7d';

const generateTokens = (payload) => {
  const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
  const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

  if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
    throw new Error('JWT secrets must be defined in environment variables');
  }
  
  const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });

  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });

  return { accessToken, refreshToken };
};

const verifyAccessToken = (token) => {
  const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
  
  if (!ACCESS_TOKEN_SECRET) {
    throw new Error('ACCESS_TOKEN_SECRET not configured');
  }
  
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch (error) {
    throw new Error('Invalid access token');
  }
};

const verifyRefreshToken = (token) => {
  const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
  
  if (!REFRESH_TOKEN_SECRET) {
    throw new Error('REFRESH_TOKEN_SECRET not configured');
  }
  
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

module.exports = {
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY,
};