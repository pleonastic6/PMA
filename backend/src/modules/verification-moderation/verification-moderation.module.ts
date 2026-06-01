import { Module } from '@nestjs/common';

import { JwtAuthGuard } from '../../common/auth/jwt-auth.guard';
import { VerificationModerationController } from './verification-moderation.controller';
import { VerificationModerationService } from './verification-moderation.service';

@Module({
  controllers: [VerificationModerationController],
  providers: [VerificationModerationService, JwtAuthGuard],
  exports: [VerificationModerationService],
})
export class VerificationModerationModule {}
