import { Controller, Get } from '@nestjs/common';

import { ok } from '../../common/http/api-response';
import { VerificationModerationService } from './verification-moderation.service';

@Controller('verification-moderation')
export class VerificationModerationController {
  constructor(
    private readonly verificationModerationService: VerificationModerationService,
  ) {}

  @Get('overview')
  getOverview() {
    return ok(
      'verification_moderation',
      this.verificationModerationService.getOverview(),
    );
  }
}
