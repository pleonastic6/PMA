import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../common/prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyProfile(userId: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { userId },
      include: {
        images: true,
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    return profile;
  }

  async updateMyProfile(userId: string, payload: UpdateProfileDto) {
    const profile = await this.prisma.profile.upsert({
      where: { userId },
      update: payload,
      create: {
        userId,
        ...payload,
      },
      include: {
        images: true,
      },
    });

    return {
      profile,
    };
  }
}
