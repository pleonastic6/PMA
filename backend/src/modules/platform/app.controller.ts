import { Controller, Get } from '@nestjs/common';

import { ok } from '../../common/http/api-response';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getRoot() {
    return ok('platform', this.appService.getRootPayload());
  }
}
