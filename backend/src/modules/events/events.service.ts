import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async listEvents(userId: string) {
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

    const events = await this.prisma.event.findMany({
      where: {
        endsAt: {
          gte: new Date(),
        },
        creatorId: {
          notIn: Array.from(blockedUserIds),
        },
      },
      include: {
        creator: {
          select: {
            id: true,
            displayName: true,
            verificationStatus: true,
          },
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                displayName: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        startsAt: 'asc',
      },
      take: 50,
    });

    return {
      events: events.map((event) => ({
        id: event.id,
        title: event.title,
        description: event.description,
        locationLabel: event.locationLabel,
        startsAt: event.startsAt,
        endsAt: event.endsAt,
        capacity: event.capacity,
        creator: event.creator,
        participantCount: event.participants.length,
        joined: event.participants.some((participant) => participant.user.id === userId),
        participants: event.participants
          .map((participant) => participant.user)
          .filter((participant) => !blockedUserIds.has(participant.id)),
      })),
      count: events.length,
    };
  }

  async createEvent(userId: string, payload: CreateEventDto) {
    if (payload.endsAt <= payload.startsAt) {
      throw new BadRequestException('endsAt must be after startsAt');
    }

    if (payload.startsAt <= new Date()) {
      throw new BadRequestException('startsAt must be in the future');
    }

    const event = await this.prisma.event.create({
      data: {
        creatorId: userId,
        title: payload.title.trim(),
        description: payload.description.trim(),
        locationLabel: payload.locationLabel.trim(),
        startsAt: payload.startsAt,
        endsAt: payload.endsAt,
        capacity: payload.capacity,
        participants: {
          create: {
            userId,
          },
        },
      },
      include: {
        creator: {
          select: {
            id: true,
            displayName: true,
            verificationStatus: true,
          },
        },
        participants: {
          include: {
            user: {
              select: {
                id: true,
                displayName: true,
              },
            },
          },
        },
      },
    });

    return {
      event: {
        id: event.id,
        title: event.title,
        description: event.description,
        locationLabel: event.locationLabel,
        startsAt: event.startsAt,
        endsAt: event.endsAt,
        capacity: event.capacity,
        creator: event.creator,
        participants: event.participants.map((participant) => participant.user),
      },
    };
  }

  async joinEvent(userId: string, eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        participants: true,
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.endsAt <= new Date()) {
      throw new BadRequestException('Event already ended');
    }

    const existingBlock = await this.prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: userId, blockedUserId: event.creatorId },
          { blockerId: event.creatorId, blockedUserId: userId },
        ],
      },
    });

    if (existingBlock) {
      throw new BadRequestException('Cannot join event due to block status');
    }

    if (event.participants.some((participant) => participant.userId === userId)) {
      throw new BadRequestException('Already joined');
    }

    if (
      event.capacity !== null &&
      event.capacity !== undefined &&
      event.participants.length >= event.capacity
    ) {
      throw new BadRequestException('Event is full');
    }

    const participant = await this.prisma.eventParticipant.create({
      data: {
        eventId,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            displayName: true,
          },
        },
      },
    });

    return {
      joined: true,
      participant: participant.user,
    };
  }
}
