import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { CurrentUser } from '../../common/auth/current-user.decorator';
import {
  AuthenticatedUser,
  JwtAuthGuard,
} from '../../common/auth/jwt-auth.guard';
import { ok } from '../../common/http/api-response';
import { CreateMessageDto } from './dto/create-message.dto';
import { ChatService } from './chat.service';

@UseGuards(JwtAuthGuard)
@Controller()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversations')
  async listConversations(@CurrentUser() user: AuthenticatedUser) {
    return ok('chat', await this.chatService.listConversations(user.sub));
  }

  @Get('matches/:id/messages')
  async listMessages(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') matchId: string,
  ) {
    return ok('chat', await this.chatService.listMessages(user.sub, matchId));
  }

  @Post('matches/:id/messages')
  async createMessage(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') matchId: string,
    @Body() payload: CreateMessageDto,
  ) {
    return ok('chat', await this.chatService.createMessage(user.sub, matchId, payload));
  }
}
