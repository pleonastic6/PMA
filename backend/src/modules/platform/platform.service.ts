import { Injectable } from '@nestjs/common';

import { HealthPayload } from '../../common/health/health.types';

@Injectable()
export class PlatformService {
  getHealth(): HealthPayload {
    return {
      status: 'ok',
      service: 'pma-backend',
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
