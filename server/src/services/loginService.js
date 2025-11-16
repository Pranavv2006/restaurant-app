const prisma = require("../models/prismaClient");
const bcrypt = require("bcrypt");
const { generateTokens } = require("../utils/jwtUtils");
const RefreshTokenService = require("./RefreshTokenService");

const login = async (email, password) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
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
      },
    });

    if (!user) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return {
        success: false,
        message: "Invalid email or password",
      };
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

    try {
      const storedToken = await RefreshTokenService.storeRefreshToken(user.id, tokens.refreshToken);
    } catch (storeError) {
      throw storeError;
    }

    return {
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          roleType: primaryRole?.type || 'User',
          role: primaryRole?.type,
          permissions: activePermissions,
          roles: activeRoles.map(role => role.type),
        },
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    };

  } catch (error) {
    
    if (error.message.includes('Failed to store refresh token')) {
      throw new Error("Failed to store authentication token. Please try again.");
    }
    
    throw new Error("Internal server error during authentication");
  }
};

module.exports = { login };