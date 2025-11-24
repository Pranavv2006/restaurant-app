const { generateTokens, verifyRefreshToken } = require('../utils/jwtUtils');
const RefreshTokenService = require('../services/RefreshTokenService');
const prisma = require('../models/prismaClient');

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

    const user = await prisma.user.findUnique({
      where: { id: tokenRecord.user.id },
      include: {
        userRoles: {
          include: {
            role: true
          }
        },
        userPermissions: {
          include: {
            permission: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const activeRoles = user.userRoles
      .filter(userRole => userRole.status === true)
      .map(userRole => userRole.role);

    const activePermissions = user.userPermissions
      .filter(userPermission => userPermission.status === true)
      .map(userPermission => userPermission.permission.desc);

    const primaryRole = activeRoles.length > 0 ? activeRoles[0] : null;

    const payload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roleType: primaryRole?.type || 'User',
      role: primaryRole?.type,
      permissions: activePermissions,
    };

    const tokens = generateTokens(payload);

    await RefreshTokenService.storeRefreshToken(user.id, tokens.refreshToken);

    await RefreshTokenService.revokeRefreshToken(refreshToken);

    res.status(200).json({
      success: true,
      message: 'Tokens refreshed successfully',
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          roleType: primaryRole?.type || 'User',
          role: primaryRole?.type,
          permissions: activePermissions,
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