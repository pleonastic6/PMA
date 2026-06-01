import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class DiscoveryService {
  constructor(private readonly prisma: PrismaService) {}

  async getCandidates(userId: string) {
    const viewer = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        preference: true,
        outgoingSwipes: {
          select: {
            targetUserId: true,
          },
        },
        initiatedMatches: {
          select: {
            userBId: true,
          },
        },
        receivedMatches: {
          select: {
            userAId: true,
          },
        },
        outgoingBlocks: {
          select: {
            blockedUserId: true,
          },
        },
        incomingBlocks: {
          select: {
            blockerId: true,
          },
        },
      },
    });

    if (!viewer) {
      throw new NotFoundException('User not found');
    }

    const swipedUserIds = viewer.outgoingSwipes.map((swipe) => swipe.targetUserId);
    const matchedUserIds = [
      ...viewer.initiatedMatches.map((match) => match.userBId),
      ...viewer.receivedMatches.map((match) => match.userAId),
    ];
    const blockedUserIds = [
      ...viewer.outgoingBlocks.map((block) => block.blockedUserId),
      ...viewer.incomingBlocks.map((block) => block.blockerId),
    ];
    const excludedIds = [
      ...new Set([userId, ...swipedUserIds, ...matchedUserIds, ...blockedUserIds]),
    ];

    const candidates = await this.prisma.user.findMany({
      where: {
        id: {
          notIn: excludedIds,
        },
        isActive: true,
        profile: {
          is: {
            onboardingComplete: true,
            age: {
              gte: viewer.preference?.minAge ?? 18,
              lte: viewer.preference?.maxAge ?? 99,
            },
          },
        },
      },
      include: {
        profile: {
          include: {
            images: {
              orderBy: {
                position: 'asc',
              },
            },
          },
        },
      },
      orderBy: [
        {
          createdAt: 'asc',
        },
        {
          id: 'asc',
        },
      ],
      take: 20,
    });

    return {
      filters: ['ageRange', 'distanceKm', 'interests'],
      candidates: candidates.map((candidate) => ({
        id: candidate.id,
        displayName: candidate.displayName,
        verificationStatus: candidate.verificationStatus,
        profile: candidate.profile,
      })),
      count: candidates.length,
    };
  }
}
