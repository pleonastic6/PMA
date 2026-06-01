import { Injectable } from '@nestjs/common';

@Injectable()
export class DiscoveryService {
  getCandidates() {
    return {
      filters: ['ageRange', 'distanceKm', 'interests'],
      candidates: [],
      status: 'scaffolded',
    };
  }
}
