import { Injectable } from '@nestjs/common';

@Injectable()
export class VerificationModerationService {
  getOverview() {
    return {
      capabilities: ['reports', 'blocks', 'verification', 'admin-endpoints'],
      status: 'scaffolded',
    };
  }
}
