import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ReportStatus } from '@prisma/client';

import { PrismaService } from '../../common/prisma/prisma.service';
import { CreateBlockDto } from './dto/create-block.dto';
import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class VerificationModerationService {
  constructor(private readonly prisma: PrismaService) {}

  getOverview() {
    return {
      capabilities: ['reports', 'blocks', 'verification', 'admin-endpoints'],
      status: 'reports-and-blocks-implemented',
    };
  }

  async listBlocks(userId: string) {
    const blocks = await this.prisma.block.findMany({
      where: {
        blockerId: userId,
      },
      include: {
        blockedUser: {
          select: {
            id: true,
            displayName: true,
            verificationStatus: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      blocks,
      count: blocks.length,
    };
  }

  async createBlock(userId: string, payload: CreateBlockDto) {
    if (userId === payload.blockedUserId) {
      throw new BadRequestException('You cannot block yourself');
    }

    const targetUser = await this.prisma.user.findUnique({
      where: {
        id: payload.blockedUserId,
      },
      select: {
        id: true,
      },
    });

    if (!targetUser) {
      throw new NotFoundException('Target user not found');
    }

    const block = await this.prisma.block.upsert({
      where: {
        blockerId_blockedUserId: {
          blockerId: userId,
          blockedUserId: payload.blockedUserId,
        },
      },
      update: {
        reason: payload.reason?.trim(),
      },
      create: {
        blockerId: userId,
        blockedUserId: payload.blockedUserId,
        reason: payload.reason?.trim(),
      },
      include: {
        blockedUser: {
          select: {
            id: true,
            displayName: true,
            verificationStatus: true,
          },
        },
      },
    });

    await this.prisma.$transaction([
      this.prisma.swipe.deleteMany({
        where: {
          OR: [
            { swiperId: userId, targetUserId: payload.blockedUserId },
            { swiperId: payload.blockedUserId, targetUserId: userId },
          ],
        },
      }),
      this.prisma.match.deleteMany({
        where: {
          OR: [
            { userAId: userId, userBId: payload.blockedUserId },
            { userAId: payload.blockedUserId, userBId: userId },
          ],
        },
      }),
    ]);

    return {
      block,
    };
  }

  async removeBlock(userId: string, blockedUserId: string) {
    const existingBlock = await this.prisma.block.findUnique({
      where: {
        blockerId_blockedUserId: {
          blockerId: userId,
          blockedUserId,
        },
      },
    });

    if (!existingBlock) {
      throw new NotFoundException('Block not found');
    }

    await this.prisma.block.delete({
      where: {
        blockerId_blockedUserId: {
          blockerId: userId,
          blockedUserId,
        },
      },
    });

    return {
      removed: true,
      blockedUserId,
    };
  }

  async listOwnReports(userId: string) {
    const reports = await this.prisma.report.findMany({
      where: {
        reporterId: userId,
      },
      include: {
        targetUser: {
          select: {
            id: true,
            displayName: true,
            verificationStatus: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      reports,
      count: reports.length,
    };
  }

  async createReport(userId: string, payload: CreateReportDto) {
    if (userId === payload.targetUserId) {
      throw new BadRequestException('You cannot report yourself');
    }

    const targetUser = await this.prisma.user.findUnique({
      where: {
        id: payload.targetUserId,
      },
      select: {
        id: true,
      },
    });

    if (!targetUser) {
      throw new NotFoundException('Target user not found');
    }

    const existingBlock = await this.prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: userId, blockedUserId: payload.targetUserId },
          { blockerId: payload.targetUserId, blockedUserId: userId },
        ],
      },
      select: {
        id: true,
      },
    });

    const report = await this.prisma.report.create({
      data: {
        reporterId: userId,
        targetUserId: payload.targetUserId,
        reason: payload.reason,
        details: payload.details?.trim(),
      },
      include: {
        targetUser: {
          select: {
            id: true,
            displayName: true,
            verificationStatus: true,
          },
        },
      },
    });

    return {
      report,
      alreadyBlocked: Boolean(existingBlock),
    };
  }

  async listReports(status?: ReportStatus) {
    const reports = await this.prisma.report.findMany({
      where: status
        ? {
            status,
          }
        : undefined,
      include: {
        reporter: {
          select: {
            id: true,
            displayName: true,
            verificationStatus: true,
          },
        },
        targetUser: {
          select: {
            id: true,
            displayName: true,
            verificationStatus: true,
          },
        },
      },
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    });

    return {
      reports,
      count: reports.length,
      filteredByStatus: status ?? null,
    };
  }
}
