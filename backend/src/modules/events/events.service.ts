import { Injectable } from '@nestjs/common';

@Injectable()
export class EventsService {
  listEvents() {
    return {
      events: [],
      status: 'scaffolded',
    };
  }
}
