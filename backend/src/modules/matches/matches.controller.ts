import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { CurrentUser } from '../../common/auth/current-user.decorator';
import {
  AuthenticatedUser,
  JwtAuthGuard,
} from '../../common/auth/jwt-auth.guard';
import { ok } from '../../common/http/api-response';
import { CreateSwipeDto } from './dto/create-swipe.dto';
import { MatchesService } from './matches.service';

@UseGuards(JwtAuthGuard)
@Controller()
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get('matches')
  async listMatches(@CurrentUser() user: AuthenticatedUser) {
    return ok('matches', await this.matchesService.listMatches(user.sub));
  }

  @Post('swipes')
  async createSwipe(
    @CurrentUser() user: AuthenticatedUser,
    @Body() payload: CreateSwipeDto,
  ) {
    return ok('matches', await this.matchesService.createSwipe(user.sub, payload));
  }
}
