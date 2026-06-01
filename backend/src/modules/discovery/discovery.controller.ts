import { Controller, Get } from '@nestjs/common';

import { ok } from '../../common/http/api-response';
import { DiscoveryService } from './discovery.service';

@Controller('discovery')
export class DiscoveryController {
  constructor(private readonly discoveryService: DiscoveryService) {}

  @Get('candidates')
  getCandidates() {
    return ok('discovery', this.discoveryService.getCandidates());
  }
}
