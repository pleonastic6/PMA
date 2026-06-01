import { Controller, Get } from '@nestjs/common';

import { ok } from '../../common/http/api-response';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('nearby')
  getNearby() {
    return ok('location', this.locationService.getNearby());
  }
}
