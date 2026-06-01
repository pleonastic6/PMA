import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Preference, Profile, User } from '@prisma/client';

import { PrismaService } from '../../common/prisma/prisma.service';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';

type UserWithRelations = User & {
  profile: Profile | null;
  preference: Preference | null;
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        preference: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      user: this.toPublicUser(user),
      profile: user.profile,
      preferences: user.preference,
    };
  }

  async updatePreferences(userId: string, payload: UpdatePreferencesDto) {
    if (
      payload.minAge !== undefined &&
      payload.maxAge !== undefined &&
      payload.minAge > payload.maxAge
    ) {
      throw new BadRequestException('minAge cannot be greater than maxAge');
    }

    const preference = await this.prisma.preference.upsert({
      where: { userId },
      update: payload,
      create: {
        userId,
        interestTags: payload.interestTags ?? [],
        minAge: payload.minAge ?? 18,
        maxAge: payload.maxAge ?? 99,
        maxDistanceKm: payload.maxDistanceKm ?? 25,
        notificationsEnabled: payload.notificationsEnabled ?? true,
      },
    });

    return {
      preferences: preference,
    };
  }

  toPublicUser(user: UserWithRelations | User) {
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      verificationStatus: user.verificationStatus,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
