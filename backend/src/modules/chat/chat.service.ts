import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../common/prisma/prisma.service';
import { MatchesService } from '../matches/matches.service';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly matchesService: MatchesService,
  ) {}

  async listConversations(userId: string) {
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
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return {
      transport: 'websocket-or-socket-io',
      conversations: matches.map((match) => {
        const otherUser = match.userAId === userId ? match.userB : match.userA;
        const lastMessage = match.messages[0] ?? null;

        return {
          matchId: match.id,
          updatedAt: match.updatedAt,
          user: {
            id: otherUser.id,
            displayName: otherUser.displayName,
            verificationStatus: otherUser.verificationStatus,
          },
          profile: otherUser.profile,
          lastMessage,
        };
      }),
      count: matches.length,
    };
  }

  async listMessages(userId: string, matchId: string) {
    await this.matchesService.getMatchForParticipant(matchId, userId);

    const messages = await this.prisma.message.findMany({
      where: {
        matchId,
      },
      include: {
        sender: {
          select: {
            id: true,
            displayName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    await this.prisma.message.updateMany({
      where: {
        matchId,
        senderId: {
          not: userId,
        },
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });

    return {
      matchId,
      messages,
      count: messages.length,
    };
  }

  async createMessage(userId: string, matchId: string, payload: CreateMessageDto) {
    await this.matchesService.getMatchForParticipant(matchId, userId);

    const now = new Date();
    const message = await this.prisma.message.create({
      data: {
        matchId,
        senderId: userId,
        content: payload.content.trim(),
      },
      include: {
        sender: {
          select: {
            id: true,
            displayName: true,
          },
        },
      },
    });

    await this.prisma.match.update({
      where: {
        id: matchId,
      },
      data: {
        updatedAt: now,
      },
    });

    return {
      message,
    };
  }
}
