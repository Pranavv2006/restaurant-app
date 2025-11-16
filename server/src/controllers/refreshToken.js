const { generateTokens, verifyRefreshToken } = require('../utils/jwtUtils');
const RefreshTokenService = require('../services/RefreshTokenService');

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required',
      });
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
      });
    }

    const tokenRecord = await RefreshTokenService.validateRefreshToken(refreshToken);

    const payload = {
      id: tokenRecord.user.id,
      email: tokenRecord.user.email,
      firstName: tokenRecord.user.firstName,
      lastName: tokenRecord.user.lastName,
      roleType: tokenRecord.user.roleType,
    };

    const tokens = generateTokens(payload);

    await RefreshTokenService.storeRefreshToken(tokenRecord.user.id, tokens.refreshToken);

    await RefreshTokenService.revokeRefreshToken(refreshToken);

    res.status(200).json({
      success: true,
      message: 'Tokens refreshed successfully',
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: {
          id: tokenRecord.user.id,
          email: tokenRecord.user.email,
          firstName: tokenRecord.user.firstName,
          lastName: tokenRecord.user.lastName,
          roleType: tokenRecord.user.roleType,
        },
      },
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to refresh token',
      error: error.message,
    });
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await RefreshTokenService.revokeRefreshToken(refreshToken);
    }

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to logout',
      error: error.message,
    });
  }
};

const logoutAll = async (req, res) => {
  try {
    const userId = req.user.id;

    await RefreshTokenService.revokeAllUserTokens(userId);

    res.status(200).json({
      success: true,
      message: 'Logged out from all devices successfully',
    });

  } catch (error) {
    console.error('Logout all error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to logout from all devices',
      error: error.message,
    });
  }
};

module.exports = {
  refreshToken,
  logout,
  logoutAll,
};