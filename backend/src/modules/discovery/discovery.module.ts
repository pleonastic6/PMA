import { Module } from '@nestjs/common';

import { JwtAuthGuard } from '../../common/auth/jwt-auth.guard';
import { DiscoveryController } from './discovery.controller';
import { DiscoveryService } from './discovery.service';

@Module({
  controllers: [DiscoveryController],
  providers: [DiscoveryService, JwtAuthGuard],
  exports: [DiscoveryService],
})
export class DiscoveryModule {}
