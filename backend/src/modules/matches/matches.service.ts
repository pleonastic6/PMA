import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Match, SwipeDirection } from '@prisma/client';

import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateSwipeDto } from './dto/create-swipe.dto';

@Injectable()
export class MatchesService {
  constructor(private readonly prisma: PrismaService) {}

  async listMatches(userId: string) {
    const blocks = await this.prisma.block.findMany({
      where: {
        OR: [{ blockerId: userId }, { blockedUserId: userId }],
      },
      select: {
        blockerId: true,
        blockedUserId: true,
      },
    });
    const blockedUserIds = new Set(
      blocks.map((block) => (block.blockerId === userId ? block.blockedUserId : block.blockerId)),
    );

    const matches = await this.prisma.match.findMany({
      where: {
        OR: [{ userAId: userId }, { userBId: userId }],
      },
      include: {
        userA: {
          include: {
            profile: true,
          },
        },
        userB: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      matches: matches.map((match) => {
        const otherUser = match.userAId === userId ? match.userB : match.userA;

        return {
          id: match.id,
          createdAt: match.createdAt,
          user: {
            id: otherUser.id,
            displayName: otherUser.displayName,
            verificationStatus: otherUser.verificationStatus,
          },
          profile: otherUser.profile,
        };
      }).filter((match) => !blockedUserIds.has(match.user.id)),
      count: matches.length,
    };
  }

  async createSwipe(userId: string, payload: CreateSwipeDto) {
    if (userId === payload.targetUserId) {
      throw new BadRequestException('You cannot swipe on yourself');
    }

    const existingBlock = await this.prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: userId, blockedUserId: payload.targetUserId },
          { blockerId: payload.targetUserId, blockedUserId: userId },
        ],
      },
    });

    if (existingBlock) {
      throw new BadRequestException('Interaction is blocked for this user');
    }

    const targetUser = await this.prisma.user.findUnique({
      where: { id: payload.targetUserId },
      include: {
        profile: true,
      },
    });

    if (!targetUser || !targetUser.isActive) {
      throw new NotFoundException('Target user not found');
    }

    if (!targetUser.profile?.onboardingComplete) {
      throw new BadRequestException('Target profile is not ready for discovery');
    }

    const swipe = await this.prisma.swipe.upsert({
      where: {
        swiperId_targetUserId: {
          swiperId: userId,
          targetUserId: payload.targetUserId,
        },
      },
      update: {
        direction: payload.direction,
      },
      create: {
        swiperId: userId,
        targetUserId: payload.targetUserId,
        direction: payload.direction,
      },
    });

    let matchCreated = false;
    let matchId: string | null = null;

    if (payload.direction === SwipeDirection.LIKE) {
      const reciprocalLike = await this.prisma.swipe.findUnique({
        where: {
          swiperId_targetUserId: {
            swiperId: payload.targetUserId,
            targetUserId: userId,
          },
        },
      });

      if (reciprocalLike?.direction === SwipeDirection.LIKE) {
        const [userAId, userBId] = [userId, payload.targetUserId].sort();
        const match = await this.prisma.match.upsert({
          where: {
            userAId_userBId: {
              userAId,
              userBId,
            },
          },
          update: {},
          create: {
            userAId,
            userBId,
          },
        });

        matchCreated = true;
        matchId = match.id;
      }
    }

    return {
      swipe,
      matchCreated,
      matchId,
    };
  }

  async getMatchForParticipant(matchId: string, userId: string): Promise<Match> {
    const match = await this.prisma.match.findFirst({
      where: {
        id: matchId,
        OR: [{ userAId: userId }, { userBId: userId }],
      },
    });

    if (!match) {
      throw new NotFoundException('Match not found');
    }

    return match;
  }
}
