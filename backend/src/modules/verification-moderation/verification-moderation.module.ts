import { Module } from '@nestjs/common';

import { VerificationModerationController } from './verification-moderation.controller';
import { VerificationModerationService } from './verification-moderation.service';

@Module({
  controllers: [VerificationModerationController],
  providers: [VerificationModerationService],
  exports: [VerificationModerationService],
})
export class VerificationModerationModule {}
