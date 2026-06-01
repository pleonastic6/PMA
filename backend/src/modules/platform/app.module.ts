import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { PrismaModule } from '../../common/prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { ChatModule } from '../chat/chat.module';
import { DiscoveryModule } from '../discovery/discovery.module';
import { EventsModule } from '../events/events.module';
import { LocationModule } from '../location/location.module';
import { MatchesModule } from '../matches/matches.module';
import { ProfilesModule } from '../profiles/profiles.module';
import { UsersModule } from '../users/users.module';
import { VerificationModerationModule } from '../verification-moderation/verification-moderation.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlatformModule } from './platform.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
    }),
    PrismaModule,
    PlatformModule,
    AuthModule,
    UsersModule,
    ProfilesModule,
    DiscoveryModule,
    MatchesModule,
    ChatModule,
    EventsModule,
    LocationModule,
    VerificationModerationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
