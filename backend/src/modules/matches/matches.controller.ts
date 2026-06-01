import { Controller, Get, Post } from '@nestjs/common';

import { ok } from '../../common/http/api-response';
import { MatchesService } from './matches.service';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Get()
  listMatches() {
    return ok('matches', this.matchesService.listMatches());
  }

  @Post('swipes')
  createSwipe() {
    return ok('matches', this.matchesService.createSwipe());
  }
}
