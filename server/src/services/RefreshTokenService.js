const prisma = require('../models/prismaClient');

class RefreshTokenService {
  static async storeRefreshToken(userId, refreshToken) {
    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const tokenRecord = await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId,
          expiresAt,
        },
      });

      return tokenRecord;
    } catch (error) {
      console.error('Error storing refresh token:', error);
      throw new Error('Failed to store refresh token');
    }
  }

  static async validateRefreshToken(refreshToken) {
    try {
      const tokenRecord = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              roleType: true,
            },
          },
        },
      });

      if (!tokenRecord) {
        throw new Error('Refresh token not found');
      }

      if (tokenRecord.isRevoked) {
        throw new Error('Refresh token has been revoked');
      }

      if (new Date() > tokenRecord.expiresAt) {
        await this.revokeRefreshToken(refreshToken);
        throw new Error('Refresh token has expired');
      }

      return tokenRecord;
    } catch (error) {
      console.error('Error validating refresh token:', error);
      throw error;
    }
  }

  static async revokeRefreshToken(refreshToken) {
    try {
      await prisma.refreshToken.update({
        where: { token: refreshToken },
        data: { isRevoked: true },
      });
    } catch (error) {
      console.error('Error revoking refresh token:', error);
      throw new Error('Failed to revoke refresh token');
    }
  }

  static async revokeAllUserTokens(userId) {
    try {
      await prisma.refreshToken.updateMany({
        where: { userId, isRevoked: false },
        data: { isRevoked: true },
      });
    } catch (error) {
      console.error('Error revoking user tokens:', error);
      throw new Error('Failed to revoke user tokens');
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

      console.log(`Cleaned up ${result.count} expired/revoked tokens`);
      return result.count;
    } catch (error) {
      console.error('Error cleaning up tokens:', error);
      throw new Error('Failed to cleanup tokens');
    }
  }
}

module.exports = RefreshTokenService;