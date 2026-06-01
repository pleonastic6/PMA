import { Controller, Get, UseGuards } from '@nestjs/common';

import { CurrentUser } from '../../common/auth/current-user.decorator';
import {
  AuthenticatedUser,
  JwtAuthGuard,
} from '../../common/auth/jwt-auth.guard';
import { ok } from '../../common/http/api-response';
import { DiscoveryService } from './discovery.service';

@UseGuards(JwtAuthGuard)
@Controller('discovery')
export class DiscoveryController {
  constructor(private readonly discoveryService: DiscoveryService) {}

  @Get('candidates')
  async getCandidates(@CurrentUser() user: AuthenticatedUser) {
    return ok('discovery', await this.discoveryService.getCandidates(user.sub));
  }
}
