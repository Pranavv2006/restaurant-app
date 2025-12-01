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
        message: 'Invalid refresh token signature',
      });
    }
    let tokenRecord;
    try {
      tokenRecord = await RefreshTokenService.validateRefreshToken(refreshToken);
    } catch (error) {
      
      let statusCode = 401;
      let message = error.message;
      
      if (error.message.includes('expired')) {
        statusCode = 401;
        message = 'Refresh token has expired. Please login again.';
      } else if (error.message.includes('revoked')) {
        statusCode = 401;
        message = 'Refresh token has been revoked. Please login again.';
      } else if (error.message.includes('not found')) {
        statusCode = 401;
        message = 'Invalid refresh token. Please login again.';
      } else if (error.message.includes('inactive')) {
        statusCode = 403;
        message = 'Account is inactive. Please contact support.';
      }
      
      return res.status(statusCode).json({
        success: false,
        message: message,
      });
    }

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

    if (!user || user.status === false) {
      return res.status(404).json({
        success: false,
        message: 'User not found or account is inactive',
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
    res.status(500).json({
      success: false,
      message: 'Failed to refresh token',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
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
    res.status(500).json({
      success: false,
      message: 'Failed to logout',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

const logoutAll = async (req, res) => {
  try {
    
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    await RefreshTokenService.revokeAllUserTokens(userId);

    res.status(200).json({
      success: true,
      message: 'Logged out from all devices successfully',
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to logout from all devices',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

module.exports = {
  refreshToken,
  logout,
  logoutAll,
};