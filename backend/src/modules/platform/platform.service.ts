import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { HealthPayload } from '../../common/health/health.types';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class PlatformService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  getHealth(): HealthPayload {
    return {
      status: 'ok',
      service: 'pma-backend',
      timestamp: new Date().toISOString(),
    };
  }

  async getReadiness() {
    await this.prisma.$queryRaw`SELECT 1`;

    return {
      status: 'ready',
      service: 'pma-backend',
      database: 'reachable',
      environment: this.configService.get<string>('NODE_ENV') ?? 'development',
      timestamp: new Date().toISOString(),
    };
  }

  getModules() {
    return [
      { name: 'platform', phase: 1, status: 'scaffolded' },
      { name: 'auth', phase: 1, status: 'scaffolded' },
      { name: 'users', phase: 1, status: 'scaffolded' },
      { name: 'profiles', phase: 1, status: 'scaffolded' },
      { name: 'discovery', phase: 2, status: 'scaffolded' },
      { name: 'matches', phase: 2, status: 'scaffolded' },
      { name: 'chat', phase: 3, status: 'scaffolded' },
      { name: 'events', phase: 3, status: 'scaffolded' },
      { name: 'location', phase: 3, status: 'scaffolded' },
      { name: 'verification_moderation', phase: 4, status: 'scaffolded' },
    ];
  }
}
