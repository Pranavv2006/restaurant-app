const prisma = require('../models/prismaClient');

class RefreshTokenService {
  static async storeRefreshToken(userId, refreshToken) {
    try {
      await this.revokeAllUserTokens(userId);
      
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); 

      const tokenRecord = await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: parseInt(userId),
          expiresAt,
          isRevoked: false, 
        },
      });
      return tokenRecord;
    } catch (error) {
      throw new Error('Failed to store refresh token: ' + error.message);
    }
  }

  static async validateRefreshToken(refreshToken) {
    try {
      
      if (!refreshToken || typeof refreshToken !== 'string') {
        throw new Error('Invalid refresh token format');
      }

      const tokenRecord = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              status: true, 
            },
          },
        },
      });

      if (!tokenRecord) {
        throw new Error('Refresh token not found');
      }

      if (!tokenRecord.user) {
        throw new Error('User not found');
      }

      if (tokenRecord.user.status === false) {
        throw new Error('User account is inactive');
      }

      if (tokenRecord.isRevoked) {
        throw new Error('Refresh token has been revoked');
      }

      if (new Date() > tokenRecord.expiresAt) {
        await this.revokeRefreshToken(refreshToken);
      }
      return tokenRecord;
    } catch (error) {
      throw error;
    }
  }

  static async revokeRefreshToken(refreshToken) {
    try {
      if (!refreshToken) {
        return;
      }

      const result = await prisma.refreshToken.updateMany({
        where: { 
          token: refreshToken,
          isRevoked: false
        },
        data: { isRevoked: true },
      });
      
      return result;
    } catch (error) {
      throw new Error('Failed to revoke refresh token: ' + error.message);
    }
  }

  static async revokeAllUserTokens(userId) {
    try {
      
      if (!userId) {
        throw new Error('User ID is required');
      }

      const result = await prisma.refreshToken.updateMany({
        where: { 
          userId: parseInt(userId), 
          isRevoked: false 
        },
        data: { isRevoked: true },
      });
      return result;
    } catch (error) {
      throw new Error('Failed to revoke user tokens: ' + error.message);
    }
  }

  static async cleanupExpiredTokens() {
    try {
      
      const result = await prisma.refreshToken.deleteMany({
        where: {
          OR: [
            { expiresAt: { lt: new Date() } },
            { isRevoked: true },
          ],
        },
      });

      return result.count;
    } catch (error) {
      throw new Error('Failed to cleanup tokens: ' + error.message);
    }
  }

  static async getUserActiveTokensCount(userId) {
    try {
      const count = await prisma.refreshToken.count({
        where: {
          userId: parseInt(userId),
          isRevoked: false,
          expiresAt: { gt: new Date() }
        }
      });
      
      return count;
    } catch (error) {
      return 0;
    }
  }

  static async isTokenValid(refreshToken) {
    try {
      await this.validateRefreshToken(refreshToken);
      return true;
    } catch (error) {
      return false;
    }
  }
}

module.exports = RefreshTokenService;