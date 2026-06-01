import { Injectable } from '@nestjs/common';

@Injectable()
export class MatchesService {
  listMatches() {
    return {
      matches: [],
      status: 'scaffolded',
    };
  }

  createSwipe() {
    return {
      message: 'Swipe endpoint scaffolded',
    };
  }
}
