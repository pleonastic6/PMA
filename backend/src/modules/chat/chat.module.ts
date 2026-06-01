import { Module } from '@nestjs/common';

import { JwtAuthGuard } from '../../common/auth/jwt-auth.guard';
import { MatchesModule } from '../matches/matches.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [MatchesModule],
  controllers: [ChatController],
  providers: [ChatService, JwtAuthGuard],
  exports: [ChatService],
})
export class ChatModule {}
