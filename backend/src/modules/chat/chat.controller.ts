import { Controller, Get } from '@nestjs/common';

import { ok } from '../../common/http/api-response';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversations')
  listConversations() {
    return ok('chat', this.chatService.listConversations());
  }
}
