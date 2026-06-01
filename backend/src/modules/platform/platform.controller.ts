import { Controller, Get } from '@nestjs/common';

import { ok } from '../../common/http/api-response';
import { PlatformService } from './platform.service';

@Controller('platform')
export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  @Get('health')
  getHealth() {
    return ok('platform', this.platformService.getHealth());
  }

  @Get('modules')
  getModules() {
    return ok('platform', this.platformService.getModules());
  }
}
