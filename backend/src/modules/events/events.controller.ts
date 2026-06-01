import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { CurrentUser } from '../../common/auth/current-user.decorator';
import {
  AuthenticatedUser,
  JwtAuthGuard,
} from '../../common/auth/jwt-auth.guard';
import { ok } from '../../common/http/api-response';
import { CreateEventDto } from './dto/create-event.dto';
import { EventsService } from './events.service';

@UseGuards(JwtAuthGuard)
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async listEvents(@CurrentUser() user: AuthenticatedUser) {
    return ok('events', await this.eventsService.listEvents(user.sub));
  }

  @Post()
  async createEvent(
    @CurrentUser() user: AuthenticatedUser,
    @Body() payload: CreateEventDto,
  ) {
    return ok('events', await this.eventsService.createEvent(user.sub, payload));
  }

  @Post(':id/join')
  async joinEvent(@CurrentUser() user: AuthenticatedUser, @Param('id') eventId: string) {
    return ok('events', await this.eventsService.joinEvent(user.sub, eventId));
  }
}
