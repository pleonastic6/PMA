import { Controller, Get } from '@nestjs/common';

import { ok } from '../../common/http/api-response';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  listEvents() {
    return ok('events', this.eventsService.listEvents());
  }
}
