import { Injectable } from '@nestjs/common';

@Injectable()
export class LocationService {
  getNearby() {
    return {
      provider: 'postgres-postgis-or-search-service',
      nearby: [],
      status: 'scaffolded',
    };
  }
}
