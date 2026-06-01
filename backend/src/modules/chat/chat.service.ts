import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  listConversations() {
    return {
      transport: 'websocket-or-socket-io',
      conversations: [],
      status: 'scaffolded',
    };
  }
}
